'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Sass dosyalarını derleme görevi
gulp.task('sass', () => {
  return gulp.src('assets/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

// Sass dosyalarını izleme görevi
gulp.task('watch', () => {
  gulp.watch('assets/sass/**/*.scss', gulp.series('sass'));
});

// Varsayılan görevi tanımlama
gulp.task('default', gulp.series('sass', 'watch'));
