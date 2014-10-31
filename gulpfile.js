var gulp = require('gulp');
var plumber = require('gulp-plumber');

var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');

var imagemin = require('gulp-imagemin');
var svg2png = require('gulp-svg2png');

var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var paths = {
    css: ['dist/css/**/*.css'],
    csslibs: ['bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'],
    sass: ['src/sass/**/*.sass'],
    img: ['src/img/**/*'],
    svg: ['src/img/svg/*.svg'],
    coffee: ['src/coffee/**/*.coffee'],
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
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('cssmin', ['sass'], function () {
    gulp.src(paths.css)
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('csslibs', function () {
    gulp.src(paths.csslibs)
        .pipe(concat('libs.css'))
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('images', function () {
    return gulp.src(paths.img)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svg2png', ['images'], function () {
    gulp.src(paths.svg)
        .pipe(svg2png())
        .pipe(gulp.dest('src/img/svg/'));
});

gulp.task('coffee', function () {
    gulp.src(paths.coffee)
        .pipe(plumber())
        .pipe(coffee())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('plugins', function () {
    gulp.src(paths.plugins)
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.coffee, ['coffee']);
    gulp.watch(paths.img, ['images', 'svg2png']);
});

gulp.task('bowerfiles', ['bower-jquery', 'bower-bootstrap']);
gulp.task('build', ['bowerfiles', 'sass', 'cssmin', 'csslibs', 'images', 'svg2png', 'coffee', 'plugins']);
gulp.task('default', ['watch']);
