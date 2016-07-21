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

gulp.task('app-js', appJs);
gulp.task('vendor-js', vendorJs);
gulp.task('scss', scss);
gulp.task('css', css);
gulp.task('start-web-server', startWebServer);
gulp.task('watch', watch);
gulp.task('build', ['app-js', 'vendor-js', 'scss', 'css']);
gulp.task('default', ['build', 'start-web-server', 'watch']);

/////////////////////


var vendorJsFiles = [

];

var sassFiles = [
  'app/assets/scss/**/*.scss',
  'app/assets/sass/**/*.sass',
];

var cssFiles = [
  'app/assets/css/**/*.css',
];

function appJs(){
  return bundle('app/index.js', 'index.js');
}

function vendorJs(){
  return bundle(vendorJsFiles, 'vender.js');
}

function bundle(inFiles, outFile) {
  return gulp.src(inFiles)
    .pipe(plumber())                    // restart gulp on error
    .pipe(sourcemaps.init())            // let sourcemaps watch this pipeline
    .pipe(babel({
      presets: ['es2015']
    }))                                 // transpile into ES5 for browsers
    .pipe(concat(outFile))          // concatenate all JS files
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))        // emit the .map file for debugging
    .pipe(gulp.dest('public'));
}

function scss(){
  var autoprefixerOptions = {
    browsers: ['last 2 versions'],
  };

  return gulp.src(sassFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cleanCSS())
    .pipe(concat('sass.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css'));
}

function css(){
  return gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('css.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
}

function startWebServer() {
  connect.server({
    root: 'app',
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
