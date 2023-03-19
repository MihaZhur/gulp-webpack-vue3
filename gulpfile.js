"use strict";
const { src, dest, task } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const fileinclude = require("gulp-file-include");
const { VueLoaderPlugin } = require("vue-loader");

const srcPath = "src/";
const distPath = process.argv.includes(`dev`) ? "dev-server" : "build";
const stateProject = process.argv.includes(`dev`)
  ? "development"
  : "production";
const vueIsState = process.argv.includes(`dev`) ? true : false;

//webpack config plugins
const webpackConfig = require("./webpack.config")
webpackConfig.mode = stateProject;
const vueLoader = new VueLoaderPlugin();
const optionsVue = new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: true,
  __VUE_PROD_DEVTOOLS__: vueIsState,
});
webpackConfig.plugins = [optionsVue, vueLoader];

//path
const path = {
  dist: {
    html: distPath + "/",
    css: `${distPath}/assets/css`,
    js: `${distPath}/assets/js`,
    images: `${distPath}/assets/images`,
    fonts: `${distPath}/assets/fonts`,
  },
  src: {
    html: srcPath + "*.html",
    css: srcPath + "assets/scss/**/*.scss",
    js: srcPath + "assets/js/**/*.js",
    images:
      srcPath +
      "assets/images/**/*.{jpg,webp,png,jpeg,webmanifest,xml,gif,ico,json,svg}",
    fonts: srcPath + "assets/fonts/**/*.{woff,woff2,eot,ttf)",
  },
  watch: {
    html: srcPath + "**/*.html",
    css: srcPath + "assets/scss/**/*.scss",
    js: srcPath + "assets/js/**/*.{js,vue}",
    images:
      srcPath +
      "assets/images/**/*.{jpg,webp,png,jpeg,webmanifest,xml,gif,ico,json}",
    fonts: srcPath + "assets/fonts/**/*.{woff,woff2,eot,ttf,svg}",
  },
  clean: "./" + distPath + "/",
};

//gulp settings
const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./" + distPath + "/",
    },
  });
};
const html = () => {
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
      })
    )
    .pipe(dest(path.dist.html))
    .pipe(browserSync.reload({ stream: true }));
};
const css = () => {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SCSS Error",
            message: "Error <%= error.message %>",
          })(err);
          this.emit("end");
        },
      })
    )
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.dist.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.dist.css))
    .pipe(browserSync.reload({ stream: true }));
};
const js = () => {
  return src("src/assets/js/**/*.{js,vue}")
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "JS Error",
            message: "Error <%= error.message %>",
          })(err);
          this.emit("end");
        },
      })
    )
    .pipe(webpackStream(webpackConfig))
    .pipe(dest(path.dist.js))
    .pipe(browserSync.reload({ stream: true }));
};
const images = () => {
  return src(path.src.images, { base: srcPath + "assets/images/" })
    // .pipe(
    //   imagemin([
    //     imagemin.gifsicle({ interlaced: true }),
    //     imagemin.mozjpeg({ quality: 75, progressive: true }),
    //     imagemin.optipng({ optimizationLevel: 5 }),
    //     imagemin.svgo({
    //       plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
    //     }),
    //   ])
    // )
    .pipe(dest(path.dist.images))
    .pipe(browserSync.reload({ stream: true }));
};
const clean = () => {
  return del(path.clean);
};
const fonts = () => {
  return src(path.src.fonts, { base: srcPath + "assets/fonts/" }).pipe(
    browserSync.reload({ stream: true })
  );
};
const watchFiles = () => {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.css, css);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.fonts, fonts);
};
const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

//tasks

task("dev", watch);
task("build", build);
