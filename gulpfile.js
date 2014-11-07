var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    css: ['dist/css/**/*.css'],
    csslibs: ['bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'],
    sass: ['src/sass/**/*.sass'],
    img: ['src/img/**/*'],
    svg: ['src/img/svg/*.svg'],
    js: ['src/js/**/*.js'],
    plugins: [
        'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
        'bower_components/modernizr/modernizr.js',
        'bower_components/jquery.customSelect/jquery.customSelect.min.js',
        'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
        'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
        'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.js',
        'bower_components/svgeezy/svgeezy.min.js']
};

gulp.task("bower-jquery", function () {
    gulp.src(['bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery/dist/jquery.min.map'])
        .pipe(gulp.dest('dist/js'))
});

gulp.task("bower-bootstrap", function () {
    gulp.src('bower_components/bootstrap-sass-official/assets/stylesheets/**/*')
        .pipe(gulp.dest('src/sass/bootstrap'))
});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe($.plumber())
        .pipe($.rubySass())
        .pipe($.autoprefixer())
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('csslibs', function () {
    gulp.src(paths.csslibs)
        .pipe($.concat('libs.css'))
        .pipe($.autoprefixer())
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('images', ['svg2png'], function () {
    return gulp.src(paths.img)
        .pipe($.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svg2png', function () {
    gulp.src(paths.svg)
        .pipe($.svg2png())
        .pipe(gulp.dest('src/img/svg/'));
});

gulp.task('js', function () {
    gulp.src(paths.js)
        .pipe($.plumber())
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('plugins', function () {
    gulp.src(paths.plugins)
        .pipe($.concat('plugins.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.img, ['images', 'svg2png']);
});

gulp.task('bowerfiles', ['bower-jquery', 'bower-bootstrap']);
gulp.task('build', ['bowerfiles', 'sass', 'csslibs', 'images', 'svg2png', 'js', 'plugins']);
gulp.task('default', ['watch']);
