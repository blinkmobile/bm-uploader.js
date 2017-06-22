const gulp = require('gulp')
const del = require('del')
const util = require('gulp-util')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const header = require('gulp-header')
const saveLicense = require('uglify-save-license')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const flow = require('gulp-flowtype')

const pkg = require('./package.json')

const DEST = 'dist'
const FILENAME = 'bm-blob-uploader.js'
const banner = `/*
 * ${pkg.name}: v${pkg.version} | ${pkg.homepage}
 * (c) ${new Date(Date.now()).getFullYear()} BlinkMobile | Released under the ${pkg.license} license
 */
`

gulp.task('clean', () => {
  return del(DEST)
})

gulp.task('build', ['clean'], () => {
  // notify the developer about what is being built
  util.log(`Creating a build
-----------------------------
${banner.replace(/^\/?\s?\*\/?/gm, '')}`)

  // perform build
  return gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(flow())
    .pipe(babel({
      presets: [['es2015', { modules: 'umd' }]]
    }))
    .pipe(header(banner))
    .pipe(rename(FILENAME))
    .pipe(gulp.dest(DEST))
})

gulp.task('minify', ['build'], () => {
  const minifiedName = (strings, filename) => filename.replace(/\.js$/, '.min.js')
  return gulp.src('dist/bm-blob-uploader.js')
    .pipe(rename(minifiedName`${FILENAME}`))
    .pipe(uglify({
      output: {
        comments: saveLicense
      }
    }))
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()) })
    .pipe(gulp.dest('dist'))
})

gulp.task('test-blob-uploader', () => {

})

gulp.task('default', ['clean', 'build', 'minify'], () => {})
