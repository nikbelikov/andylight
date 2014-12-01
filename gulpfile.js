var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    css: ['dist/css/**/*.css'],
    csslibs: ['bower_components/animate.css/animate.min.css', 'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'],
    sass: ['src/sass/**/*.sass'],
    img: ['src/img/*', '!src/img/icons'],
    svg: ['src/img/svg/*.svg'],
    icons: ['src/img/icons/*.png'],
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

gulp.task('bower-jquery', function () {
    gulp.src(['bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery/dist/jquery.min.map'])
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bower-bootstrap', function () {
    gulp.src('bower_components/bootstrap-sass-official/assets/stylesheets/**/*')
        .pipe(gulp.dest('src/sass/bootstrap'));
});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe($.plumber())
        .pipe($.rubySass({ "sourcemap=none": true }))
        .pipe($.autoprefixer())
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('csslibs', function () {
    gulp.src(paths.csslibs)
        .pipe($.concat('libs.css'))
        .pipe($.autoprefixer())
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src(paths.icons).pipe($.spritesmith({
        imgName: '../img/sprite.png',
        cssName: '_sprites.sass',
        algorithm: 'binary-tree'
    }));
    spriteData.img.pipe(gulp.dest('./src/img/'));
    spriteData.css.pipe(gulp.dest('./src/sass/'));
});

gulp.task('svg2png', function () {
    gulp.src(paths.svg)
        .pipe($.svg2png())
        .pipe(gulp.dest('src/img/svg/'));
});

gulp.task('images', ['svg2png'], function () {
    return gulp.src(paths.img)
        .pipe($.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('js', function () {
    gulp.src(paths.js)
        .pipe($.plumber())
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('plugins', function () {
    gulp.src(paths.plugins)
        .pipe($.concat('plugins.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.img, ['images']);
    gulp.watch(paths.svg, ['svg2png', 'images']);
    gulp.watch(paths.icons, ['sprite', 'images']);
});

gulp.task('bowerfiles', ['bower-jquery', 'bower-bootstrap']);
gulp.task('build', ['bowerfiles', 'sprite', 'sass', 'csslibs', 'svg2png', 'images', 'js', 'plugins']);
gulp.task('default', ['watch']);
