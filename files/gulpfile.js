const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const wait = require('gulp-wait');
const bs = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const tiny = require('gulp-tinypng-nokey');
const cache = require('gulp-cache');
const gcmq = require('gulp-group-css-media-queries');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const njkRender = require('gulp-nunjucks-render');
const prettify = require('gulp-html-prettify');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const gulpif = require('gulp-if');
const merge = require('merge-stream');
const webpackStream = require('webpack-stream');
const { webpack } = webpackStream;
const webpackConfig = require('./webpack.config.js');
const config = require('./config');

function transfer(srcPath, destPath) {
  return gulp.src(srcPath)
    .pipe(gulp.dest(destPath));
}

// =========
// Sass task
// =========
function sassTask() {

  return gulp.src(`${config.sass}/*`)
    .pipe(gulpif(config.env === 'development', sourcemaps.init()))
    .pipe(wait(500)) // !!!
    .pipe(changed(config.css))
    .pipe(sass())
    .on('error', notify.onError())
    .pipe(gcmq())
    .pipe(autoprefixer({
      cascade: false,
      flexbox: 'no-2009',
    }))
    .pipe(gulpif(config.env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(config.css))
    .pipe(bs.stream());
}

exports.sassTask = sassTask;


// ============
// Css min task
// ============
function cssMin(cb) {
  cb();

  return gulp.src(`${config.css}/*.css`)
    .pipe(gulpif(
      config.env === 'production',
      cleanCSS({
        level: 2,
      }))
    )
    .pipe(gulp.dest(`${config.css}/`));

}

exports.cssMin = cssMin;

exports.cssLibs = gulp.series(sassTask, cssMin);


// ====================
// Nunjucks render task
// ====================
function nunjucks(cb) {
  cb();

  return gulp.src(`${config.nunjucksPages}/*.+(html|njk)`)
    .pipe(changed(config.basePathSrc))
    .pipe(njkRender({
      path: [config.nunjucksTemplate],
    }))
    .on('error', notify.onError())
    .pipe(prettify({
      indent_size: 2,
    }))
    .pipe(gulp.dest(config.basePathBuild));
}

exports.nunjucks = nunjucks;


// =====================
// Clear and clean tasks
// =====================
function clear() {
  return cache.clearAll();
}

exports.clear = clear;

function clean() {
  return del([
    config.basePathBuild + '/css',
    config.basePathBuild + '/js',
    config.basePathBuild + '/img',
    '!' + config.basePathBuild + '/index.php',
    '!' + config.basePathBuild + '/sitemap.xml',
    '!' + config.basePathBuild + '/sitemap',
    '!' + config.basePathBuild + '/.htaccess',
  ]);
}

exports.clean = clean;


// ===========================
// Scripts concat and min task
// ===========================
// Поиск уже минифицированных файлов
// eslint-disable-next-line no-unused-vars
const notMinified = function (file) {
  return !/\.min\.js/.test(file.path);
};

function scripts(cb) {
  cb();

  return gulp.src(`${config.jsModules}/*.js`)
    .on('error', notify.onError())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(config.js))
    .pipe(bs.stream());
}

exports.scripts = scripts;


// ===========
// Imgmin task
// ===========
function imgmin() {
  const imgminPngJpg = gulp.src(`${config.img}/**/*.+(jpg|png)`)
    .pipe(cache(tiny()))
    .pipe(gulp.dest(`${config.imgBuild}`));

  const imgminSvg = gulp.src(`${config.img}/**/*.svg`, { dot: true, ignore: `${config.svg}/**/*.svg` })
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(gulp.dest(`${config.imgBuild}`));

  const transferGif = transfer(`${config.img}/**/*.gif`, `${config.imgBuild}`);

  return merge(imgminPngJpg, imgminSvg, transferGif);
}

function transferFavicon() {
  const transferFavicon = transfer(`${config.favicon}/*`, `${config.faviconBuild}`);

  return transferFavicon
}

exports.imgmin = imgmin;

exports.transferFavicon = transferFavicon;


// =========
// SVG tasks
// =========
// Конкантенация и минификация svg файлов
function concatSvg() {
  return gulp.src(`${config.svg}/*.svg`)
    .pipe(svgmin((file) => {
      const prefix = path.basename(file.relative, path.extname(file.relative));

      return {
        plugins: [{
          cleanupIDs: {
            prefix: `${prefix}-`,
            minify: true,
          },
        }],
      };
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(`${config.svgBuild}/min`));
}

exports.concatSvg = concatSvg;


// ==========
// Watch task
// ==========
function watch() {
  // Sass
  gulp.watch(`${config.sass}/**/*`, gulp.parallel(sassTask, cssMin));

  // Nunjucks
  gulp.watch(`${config.njk}/**/*`, gulp.parallel(nunjucks));

  // SVG + image
  gulp.watch(`${config.svg}/*.svg`, gulp.series(concatSvg));
  gulp.watch(`${config.img}/**/*.+(jpg|png|svg)`, { dot: true, ignore: `${config.svg}/**/*.svg` }, imgmin);
}

exports.watch = gulp.parallel(watch, scripts, transferFavicon);

// ==========
// Build task
// ==========
function transfers(cb) {
  // Fonts
  transfer(`${config.fonts}/**/*`, `${config.basePathBuild}/fonts`);

  // Autodevelop
  // transfer(config.basePathSrc + '/php/autodevelop.php', config.basePathBuild);

  cb();
}

function buildTask(cb) {
  config.setEnv('production');
  webpackConfig.mode = 'production';
  webpackConfig.watch = false;
  webpackConfig.devtool = false;

  cb();
}

exports.build = gulp.series(
  clean,
  buildTask,
  scripts,
  gulp.parallel(
    gulp.series(
      transferFavicon,
      imgmin,
      concatSvg
    ),
    //nunjucks,
    gulp.series(sassTask, cssMin),
    transfers,
  )
);


// =====================================
// Serve task (Browser Sync live reload)
// =====================================
function serve() {
  bs({
    server: {
      baseDir: `./${config.basePathBuild}`,
    },
    notify: false,
  });

  // Sass
  bs.watch(`${config.sass}/**/*.+(sass|scss)`, gulp.series(sassTask, cssMin));

  // Nunjucks
  bs.watch(`${config.njk}/**/*.njk`, gulp.series(nunjucks));

  // JS
  bs.watch(`${config.js}/*.js`).on('change', bs.reload);

  // HTML
  //bs.watch(`${config.basePathBuild}/*.html`).on('change', bs.reload);

  // SVG + image
  gulp.watch(`${config.svg}/*.svg`, gulp.series(concatSvg));
  gulp.watch(`${config.img}/**/*.+(jpg|png|svg)`, { dot: true, ignore: `${config.svg}/**/*.svg` }, imgmin);
}

exports.serve = serve;


// ====================
// Default task (serve)
// ====================
exports.default = gulp.parallel(serve, scripts, imgmin, concatSvg, transfers);
