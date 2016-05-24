var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');

gulp.task('statics', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));
  gulp.src('./app/images/**/*')
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('lint', function() {
  return gulp.src('app/scripts/**')
    .pipe(eslint({
      extends: 'google',
      rules: {
        quotes: ['warn', 'single'],
        'linebreak-style': ["error", "windows"]
      },
      globals: {
        "$": true,
        "document": true
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 4000
  });
});

gulp.task('browserify', function() {
  return browserify('./app/scripts/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/scripts/'));
});


gulp.task('default', ['connect']);
gulp.task('build', ['lint']);
gulp.task('build', ['statics', 'browserify', 'connect']);
