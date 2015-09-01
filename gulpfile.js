var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer-core');
var cssnano = require('cssnano');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var es = require('event-stream');
var $ = require('gulp-load-plugins')();

gulp.task('copy-bootstrap', function () {
    gulp.src('node_modules/bootstrap-sass/assets/**/*')
        .pipe(gulp.dest('src/sass/bootstrap'));
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch(['src/sass/**/*.sass', 'src/sass/**/*.scss'], ['sass']);
    gulp.watch('src/img/**/*', ['webp']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});


gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe($.jade({
            pretty: "    "
        }).on('error', function (err) {
            console.log(err);
        }))
        .pipe(gulp.dest(''))
        .pipe(browserSync.stream({once: true}));
});

var postcssPlugins = [
    autoprefixer({
        browsers: ['last 2 versions']
    }),
    cssnano()
];

gulp.task('sass', ['jade'], function () {
    return $.rubySass('src/sass', {style: 'expanded'})
        .pipe($.rename({
            suffix: ".min"
        }))
        //.pipe($.uncss({
        //    html: ['index.html']
        //}))
        .pipe($.postcss(postcssPlugins))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({once: true}));
});

gulp.task('csslibs', function () {
    gulp.src([])
        .pipe($.concat('libs.min.css'))
        .pipe($.postcss(postcssPlugins))
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
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream({once: true}));
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
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream({once: true}));
    });
    return es.merge.apply(null, tasks);
});

gulp.task('build', ['sass', 'csslibs', 'webp', 'uglify']);
gulp.task('default', ['serve']);
