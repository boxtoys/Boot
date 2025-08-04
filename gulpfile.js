const fs = require('fs')
const gulp = require('gulp')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const htmlmin = require('gulp-htmlmin')
const inlineSource = require('gulp-inline-source')

function generateVersion() {
  return 'v' + Date.now()
}

function updateServiceWorkerVersion(cb) {
  const swPath = 'web/sw.js'
  const newVersion = generateVersion()
  
  console.log(`🔄 Updating Service Worker version to: ${newVersion}`)
  
  try {
    let swContent = fs.readFileSync(swPath, 'utf8')
    
    swContent = swContent.replace(
      /const CACHE_VERSION = "[^"]+"/,
      `const CACHE_VERSION = "${newVersion}"`
    )
    
    fs.writeFileSync(swPath, swContent)
    
    console.log(`✅ Service Worker version updated successfully!`)
    cb()
  } catch (error) {
    console.error('❌ Error updating Service Worker version:', error)
    cb(error)
  }
}

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

const tasks = gulp.series(updateServiceWorkerVersion, buildCSS, minify)

module.exports = { tasks }
