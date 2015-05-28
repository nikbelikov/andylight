var gulp = require('gulp');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var es = require('event-stream');
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

gulp.task('sass', ['jade'], function () {
    return $.rubySass('src/sass', {style: 'expanded'})
        .pipe($.rename({
            suffix: ".min"
        }))
        //.pipe($.uncss({
        //    html: ['index.html']
        //}))
        .pipe($.autoprefixer())
        .pipe($.cssmin())
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

gulp.task('webp', ['images'], function () {
    return gulp.src('dist/img/**/*')
        .pipe($.webp())
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
    var files = [
        'app.js'
    ];
    var tasks = files.map(function(entry) {
        return browserify({
            entries: ['src/js/' + entry],
            debug: true
        })
            .bundle()
            .pipe(vinylSourceStream(entry))
            .pipe($.rename({
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest('dist/js'));
    });
    return es.merge.apply(null, tasks);
});

gulp.task('watch', function () {
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/img/**/*', ['webp']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});

gulp.task('build', ['jade', 'sass', 'csslibs', 'webp', 'uglify']);
gulp.task('default', ['watch']);
