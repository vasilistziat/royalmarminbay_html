const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const reload = browserSync.reload;

const jsroot = './src/js/';

// Vendor js and plugins
const vendorModules = {
  consoleErrorsFix: jsroot + 'vendor/console.errors.fix.js',
  swiperSlider: jsroot + 'vendor/swiper.11.1.3.min.js',
};

// Load js files in the right way.
const mainJsFiles = [
  vendorModules.consoleErrorsFix,
  vendorModules.swiperSlider,
  jsroot + 'main.js'
];

// SASS Task
gulp.task('sass', () => {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) //compile sass to compact css
    .pipe(autoprefixer('last 2 version', 'ie 9')) //prefix css
    .pipe(rename('styles.unmin.css')) //set name of unmin file
    .pipe(gulp.dest('./dist/css/unmin/')) //save unmin css file
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) //copile sass to compressed css
    .pipe(cleanCSS({ compatibility: 'ie9' })) //clean css file
    .pipe(rename('styles.min.css')) //set name of min file
    .pipe(gulp.dest('./dist/css/min/'))
    .pipe(browserSync.stream()); //save min css file
});

// JS Task
gulp.task('js', () => {
  return gulp
    .src(mainJsFiles)
    .pipe(babel({ presets: ['@babel/env'] })) //babel transpiler to ES5
    .pipe(concat('main.js')) //concatanation
    .pipe(gulp.dest('./dist/js/unmin/')) //save unmin file
    .pipe(rename('main.min.js')) //rename file
    .pipe(uglify()) //uglify
    .pipe(gulp.dest('./dist/js/min/')); //save min file 
});

// Builder Task
gulp.task('build', gulp.series('sass', 'js'));

// Watcher Task
gulp.task('watch', () => {
  gulp.watch(['./src/scss/**/*.scss'], gulp.series('sass'));
  gulp.watch(['./src/js/**/*.js'], gulp.series('js'));
});

gulp.task('dev', function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  gulp.watch(['./src/scss/**/*.scss'], gulp.series('sass')).on('change', browserSync.stream);
  gulp.watch(['./src/js/**/*.js'], gulp.series('js')).on('change', reload);
  gulp.watch("*.html").on('change', reload);
});
