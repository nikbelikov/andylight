var gulp = require('gulp');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var watchify = require('watchify');
var assign = require('lodash.assign');
var $ = require('gulp-load-plugins')();

var paths = {
    csslibs: []
};

gulp.task('jade', function() {
    gulp.src('jade/*.jade')
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

gulp.task('cleanImages', function () {
    return gulp.src('dist/img', {read: false})
        .pipe($.clean());
});

gulp.task('images', ['cleanImages'], function () {
    return gulp.src('src/img/**/*')
        .pipe($.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('uglify', ['browserify'], function() {
    return gulp.src('dist/js/*.js')
        .pipe($.uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify', function() {
    return browserify('src/js/app.js')
        .bundle()
        .pipe(vinylSourceStream('bundle.js'))
        .pipe(gulp.dest('dist/js'));
});

var customOpts = {
    entries: ['src/js/app.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('browserify-watch', browserifybundle);
b.on('update', browserifybundle);

function browserifybundle() {
    return b.bundle()
        .pipe(vinylSourceStream('bundle.js'))
        .pipe(gulp.dest('dist/js'));
}

gulp.task('watch', function () {
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/img/**/*', ['images']);
});

gulp.task('build', ['jade', 'sass', 'csslibs', 'images', 'uglify']);
gulp.task('default', ['watch', 'browserify-watch']);
