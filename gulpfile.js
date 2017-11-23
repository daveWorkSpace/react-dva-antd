const gulp= require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const _package = require('./package.json');
const _dist = './dist/';

function randomString(len) {
  const timestamp = new Date().getTime();
  const lens = len || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  var pwd = '';
  　for (i = 0; i < lens; i++) {
    　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　}
  　return `${pwd}${timestamp}`;
}

gulp.task('copy_img', () => {
  //拷图片
  gulp.src('./images/*')
  .pipe(gulp.dest('./dist/images'));

  gulp.src('./images/business/*')
  .pipe(gulp.dest('./dist/images/business'));

  gulp.src('./images/new/*')
  .pipe(gulp.dest('./dist/images/new'));
});

gulp.task('version_chunk', () => {
  //add_version_then_concat_chunk
  //改版html本号
  const random = randomString(6);
  gulp.src([`${_dist}index.html`])
  .pipe(replace('.js?version', `.${_package.version}.js?v=${random}`))
  .pipe(replace('.css?version', `.${_package.version}.css?v=${random}`))
  .pipe(gulp.dest('./dist/'));

  //改版文件
  // gulp.src([`${_dist}common.js`, `${_dist}config.js`, `${_dist}index.css`, `${_dist}index.js`, `${_dist}vendor.js`])
  // .pipe(rename({
  //   dirname: '',
  //   prefix: `.${_package.version}`,
  // }))
  // .pipe(gulp.dest('./dist/'));

  gulp.src([`${_dist}common.js`, `${_dist}config.js`, `${_dist}index.css`, `${_dist}index.js`, `${_dist}vendor.js`])
  .pipe(rename((path) => {
    path.basename += `.${_package.version}`
    // path.extname += `?v=${random}`
  }))
  .pipe(gulp.dest('./dist/'));

  //合并chunk文件
  gulp.src(`${_dist}*.aoao-chunk.js`)
  .pipe(concat(`chunk-bundle.${_package.version}.js`))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('clean-scripts', () => {
  //清除chunk文件
  gulp.src([`${_dist}common.js`, `${_dist}config.js`, `${_dist}index.css`, `${_dist}index.js`, `${_dist}vendor.js`, `${_dist}*.aoao-chunk.js`], { read: false })
  .pipe(clean());
});
