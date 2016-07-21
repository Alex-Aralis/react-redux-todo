var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');

gulp.task('bundle-js', bundleJs);
gulp.task('bundle-css', bundleCss);
gulp.task('start-web-server', startWebServer);
gulp.task('watch', watch);
gulp.task('index-html', indexHtml);
gulp.task('build', ['bundle-js', 'index-html', 'bundle-css']);
gulp.task('default', ['build', 'start-web-server', 'watch']);

/////////////////////

var cssFiles = [
  'app/assets/scss/**/*.scss',
  'app/assets/sass/**/*.sass',
  'app/assets/css/**/*.css',
];

function indexHtml(){
  return gulp.src('app/index.html')
    .pipe(gulp.dest('public'));
}

function bundleJs() {
  return gulp.src('app/index.js')
    .pipe(plumber())                    // restart gulp on error
    .pipe(sourcemaps.init())            // let sourcemaps watch this pipeline
    .pipe(babel({
      presets: ['es2015']
    }))                                 // transpile into ES5 for browsers
    .pipe(concat('index.js'))          // concatenate all JS files
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))        // emit the .map file for debugging
    .pipe(gulp.dest('public'));
}

function bundleCss(){
  var autoprefixerOptions = {
    browsers: ['last 2 versions'],
  };

  return gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cleanCSS())
    .pipe(concat('index.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css'));
}

function startWebServer() {
  connect.server({
    root: 'public',
    port: 8000,
  });
}

function watch() {
  gulp.watch([
    'app/**/*',
    '!app/content/*',
    'node_componets/**/*',
  ], ['build']);
}
