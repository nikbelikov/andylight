var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserify = require('browserify');
var babel = require('babelify');
var vinylSourceStream = require('vinyl-source-stream');
var es = require('event-stream');
var $ = require('gulp-load-plugins')();

gulp.task('copy-bootstrap', function () {
    gulp.src('node_modules/bootstrap-sass/assets/**/*')
        .pipe(gulp.dest('src/sass/bootstrap'));
});

gulp.task('serve', ['sass', 'browserify'], function () {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch('src/jade/**/*.jade', ['jade']);
    gulp.watch(['src/sass/**/*.sass', 'src/sass/**/*.scss'], ['sass']);
    gulp.watch('src/img/**/*', ['webp']);
    gulp.watch('src/js/**/*', ['browserify']);
});

gulp.task('jade', function () {
    return gulp.src('src/jade/*.jade')
        .pipe($.jade({
            pretty: "    "
        }).on('error', $.notify.onError({
            title: "Jade Error",
            message: "<%= error.message %>"
        })))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({once: true}));
});

var postcssPlugins = [
    autoprefixer({
        browsers: ['last 2 versions']
    }),
    cssnano()
];

gulp.task('sass', function () {
    gulp.src('src/sass/**/*.sass')
        .pipe($.sass()
        .on('error', $.notify.onError({
            title: "Sass Error",
            message: "<%= error.message %>"
        })))
        .pipe($.rename({
            suffix: ".min"
        }))
        //.pipe($.uncss({
        //    html: ['index.html']
        //}))
        .pipe($.postcss(postcssPlugins))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('csslibs', function () {
    var csslibs = [];

    gulp.src(csslibs)
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

gulp.task('uglify', ['browserify'], function () {
    return gulp.src('dist/js/*.js')
        .pipe($.uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify', function () {
    var files = [
        'app.js'
    ];
    var tasks = files.map(function (entry) {
        return browserify({
            entries: ['src/js/' + entry],
            debug: true
        })
            .transform(babel)
            .bundle()
            .on('error', $.notify.onError({
                title: "Scripts Error",
                message: "<%= error.message %>"
            }))
            .pipe(vinylSourceStream(entry))
            .pipe($.rename({
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream({once: true}));
    });
    return es.merge.apply(null, tasks);
});

gulp.task('build', ['jade', 'sass', 'csslibs', 'webp', 'uglify']);
gulp.task('default', ['serve']);
