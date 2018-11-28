'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins');
var rigger = require('gulp-rigger');
var concat = require('gulp-concat');
var order = require("gulp-order");
var addsrc = require('gulp-add-src');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var pug = require('gulp-pug');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var del = require('del');
var browserify = require('browserify');
var autoprefixer = require('autoprefixer');
var browsersync = require('browser-sync');
var ngAnnotate = require('browserify-ngannotate');
var server = require('browser-sync').create();
var reload = server.reload;


var path = {
  build: {
    html:'build/',
    htmlIndex:'build/index.html',

    js: 'build/js',
    jsMin: 'build/js/js-minifyed/',
    css: 'build/css/',
    cssMin: 'build/css/final-minifyed/',
    img: 'build/img/'
  },
  dev: {
    html: ['src/_template/*.html','src/_template/**/*.html'],
    htmlIndex:['src/_template/index.html'],
    htmlToMin: ['build/*.html'],

    js: ['src/_js/*.js'],
    jsToMin: ['build/js/*.js'],
    img: ['src/_img/**/*'],
    scss: ['src/_scss/main.scss', 'bower_components/bootstrap/dist/bootstrap.css'],
    cssfin:  ['build/css/*.css'],
    scssall: ['src/_scss/**/**/*.scss'],
    json: ['static.json']
  }
};


// ===============
// build html
// ===============

gulp.task('buildhtml', function () {
  return gulp.src(path.dev.html)
  .pipe(rigger())
  .pipe(gulp.dest(path.build.html))
  .pipe(reload({stream: true}));
});

gulp.task('buildindexhtml', function () {
  return gulp.src(path.dev.htmlIndex)
  .pipe(rigger())
  .pipe(gulp.dest(pathout.html))
  .pipe(reload({stream: true}));
});

gulp.task('minhtml', function () {
  return gulp.src(path.dev.htmlToMin)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(rename({suffix: '-min'}))
  .pipe(gulp.dest(path.build.html));
});

// ===============
// build css
// ===============

gulp.task('buildcss', function () {
  return gulp.src(path.dev.scss)
  .pipe(rigger())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));
});

gulp.task('mincss', function () {
  return gulp.src(path.dev.cssfin)
  .pipe(minifycss())
  .pipe(sourcemaps.write())
  .pipe(rename({suffix: '-min'}))
  .pipe(gulp.dest(path.build.cssMin));
});

// ===============
// minify img
// ===============

gulp.task('imgmin', function () {
  var imagemin = require('gulp-imagemin');
  var png = require('imagemin-pngquant');
  var jpeg = require('imagemin-jpegtran');
  var svg = require('imagemin-svgo');

  return gulp.src(path.dev.img)
  .pipe(imagemin({
    progressive: true,
    use: [jpeg(), png(), svg()]
  }))
  .pipe(gulp.dest(path.build.img))
  .pipe(reload({stream: true}));
});

// ===============
// build js
// ===============

gulp.task('buildjs', function () {
  return gulp.src(path.dev.js)
  .pipe(concat('main.js'))
  .pipe(gulp.dest(path.build.js))
});

gulp.task('minjs', function () {
  return gulp.src(path.dev.jsToMin)
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.build.jsMin))
  .pipe(reload({stream: true}));
});

// ===============
// Inject
// ===============

gulp.task('inject',['default'], function () {
  var sources = gulp.src(['build/js/libs/*.js','build/js/*.js','build/css/libs/*.css','build/css/*.css'], {read:false});

  return gulp.src(path.build.htmlIndex)
  .pipe(inject( sources, { relative:true } ))
  .pipe(gulp.dest('build/'))
  .pipe(reload({stream: true}));
});

// ===============
// Sync
// ===============

gulp.task('browsersync', function () {
  server.init({
    server: {
      baseDir: './build/'
    },
    port: 8081,
    open: true,
    notify: false
  });
});

// ===============
// Clean
// ===============

gulp.task('clean', function () {
  del(['build/']);
});

// ===============
// intall bower dependencies
// ===============

gulp.task('bower', function() {
  var install = require("gulp-install");

  return gulp.src(['bower.json'])
      .pipe(install());
});

// ===============
// Copy ExternalLibs and Static JSON
// ===============

gulp.task('copyJSON',function() {
  return gulp.src(path.dev.json)
  .pipe(gulp.dest('build/'));
});

gulp.task('copyExternalCss', function () {
  return gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
  .pipe(gulp.dest('build/css/libs'))
});

gulp.task('copyExternalJs', function () {
  return gulp.src(['node_modules/angular/angular.min.js',
  'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('build/js/libs'))
});

// ===============
// Watch
// ===============

gulp.task('watch', function () {
  gulp.watch(path.dev.html, ['buildhtml','inject']);
  gulp.watch(path.dev.scssall, ['buildcss']);
  gulp.watch(path.dev.js, ['buildjs']);
});

// ===============
// Complex Serve Tasks
// ===============

gulp.task('serve', ['inject','watch','browsersync','copyJSON']);

gulp.task('copyExternalComponents', ['copyExternalJs','copyExternalCss']);
gulp.task('default', ['buildhtml','buildcss', 'buildjs','copyExternalComponents']);
gulp.task('minify', ['minhtml', 'minjs', 'mincss', 'browsersync']);
gulp.task('build', ['buildhtml', 'buildjs', 'buildcss', 'minhtml', 'minjs', 'mincss', 'browsersync']);
