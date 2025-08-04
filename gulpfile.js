const gulp = require('gulp')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const htmlmin = require('gulp-htmlmin')
const inlineSource = require('gulp-inline-source')

function buildCSS() {
  return gulp.src('web/assets/css/styles.css')
    .pipe(postcss([
      require('tailwindcss'),
      require('autoprefixer')
    ]))
    .pipe(rename('tailwind.css'))
    .pipe(gulp.dest('web/assets/css'))
}

function minify() {
  return gulp.src('web/index.html')
    .pipe(inlineSource({
      compress: true
    }))
    .pipe(htmlmin({
      minifyJS: true,
      minifyCSS: true,
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(rename('index.min.html'))
    .pipe(gulp.dest('web'))
}

module.exports = { minify, buildCSS }
