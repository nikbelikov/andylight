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

gulp.task('copy-favicons', function () {
  gulp.src('src/favicons/*')
    .pipe($.newer('dist/favicons'))
    .pipe(gulp.dest('dist/favicons'));
});

gulp.task('serve', ['sass', 'browserify'], function () {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch(['src/sass/**/*.sass', 'src/sass/**/*.scss'], ['sass']);
  gulp.watch('src/img/svg/icons/**/*', ['svgstore']);
  gulp.watch(['src/img/**/*', '!src/img/svg/icons/**/*'], ['webp']);
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
  cssnano({
    zindex: false,
    reduceIdents: false,
    discardUnused: false,
    mergeIdents: false
  })
];

gulp.task('sass-build', function () {
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
    //    html: ['index.html'],
    //    ignore: [
    //        '.my-selector'
    //    ]
    //}))
    .pipe($.postcss(postcssPlugins))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.sass')
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.notify.onError({
        title: "Sass Error",
        message: "<%= error.message %>"
      })))
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe($.postcss([
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('svgstore', function () {
  return gulp
    .src('src/img/svg/icons/**/*.svg')
    .pipe($.svgmin({
      plugins: [
        {
          removeAttrs: {
            attrs: ['fill']
          }
        }
      ]
    }))
    .pipe($.svgstore({inlineSvg: true}))
    .pipe($.svg2string())
    .pipe(gulp.dest('dist/img/svg'));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe($.newer('dist/img'))
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('webp', ['images'], function () {
  return gulp.src(['dist/img/**/*.jpg', 'dist/img/**/*.png'])
    .pipe($.cached('dist/img'))
    .pipe($.webp({
      quality: 85
    }))
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

gulp.task('browserify', ['lint'], function () {
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

gulp.task('lint', () => {
  return gulp.src('src/js/**/*')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('build', ['jade', 'sass-build', 'svgstore', 'webp', 'uglify', 'copy-favicons']);
gulp.task('default', ['serve']);
