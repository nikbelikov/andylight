var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    css: ['dist/css/**/*.css'],
    csslibs: [],
    sass: ['src/sass/**/*.sass'],
    img: ['src/img/**/*'],
    svg: ['src/img/svg/*.svg'],
    js: ['src/js/**/*.js'],
    plugins: [
        'bower_components/modernizr/modernizr.js'
    ]
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
    return $.rubySass('src/sass/main.sass', {style: 'expanded'})
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

gulp.task('images', function () {
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
});

gulp.task('bowerfiles', ['bower-jquery', 'bower-bootstrap']);
gulp.task('build', ['sass', 'csslibs', 'images', 'js', 'plugins']);
gulp.task('default', ['watch']);
