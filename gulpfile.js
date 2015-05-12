var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    jadeAll: ['jade/**/*.jade'],
    jadeSrc: ['jade/*.jade'],
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

gulp.task('jade', function() {
    gulp.src(paths.jadeSrc)
        .pipe($.jade({
            pretty: "    "
        }).on('error', function (err) {
            console.log(err);
        }))
        .pipe(gulp.dest(''))
});

gulp.task('sass', function () {
    return $.rubySass('src/sass', {style: 'expanded'})
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.cssmin())
        .pipe($.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('csslibs', function () {
    gulp.src(paths.csslibs)
        .pipe($.concat('libs.min.css'))
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
        .pipe($.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('plugins', function () {
    gulp.src(paths.plugins)
        .pipe($.concat('plugins.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.jadeAll, ['jade']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.img, ['images']);
});

gulp.task('bowerfiles', ['bower-jquery', 'bower-bootstrap']);
gulp.task('build', ['jade', 'sass', 'csslibs', 'images', 'js', 'plugins']);
gulp.task('default', ['watch']);
