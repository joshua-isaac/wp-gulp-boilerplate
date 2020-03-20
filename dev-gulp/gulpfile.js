// proxy path
const proxyPath = "http://localhost:10000/";

// import gulp + plugins
const gulp = require("gulp"),
  browserSync = require("browser-sync"),
  autoprefixer = require("gulp-autoprefixer"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify");

// root path
const root = "../";

// working paths
const scss = root + "src/scss",
  js = root + "src/js",
  jsDist = root + "dist/js",
  cssDist = root + "dist/css";

// watch files
const phpWatchFiles = root + "**/*.php",
  styleWatchFiles = root + "**/*.scss";

// css function that process scss, autoprefixes and minifies into css
function css() {
  return gulp
    .src([scss + "/styles.scss"])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDist));
}

// javascript function that minifies js
function javascript() {
  return gulp
    .src(js + "/scripts.js")
    .pipe(uglify())
    .pipe(gulp.dest(jsDist));
}

// watch task that watches for php, scss or js changes and hot reloads
function watch() {
  browserSync.init({
    open: "external",
    proxy: `${proxyPath}`,
  });
  gulp.watch(styleWatchFiles, gulp.series([css]));
  gulp.watch(js, javascript);
  gulp
    .watch([phpWatchFiles, jsDist + "/scripts.js", cssDist + "/styles.css"])
    .on("change", browserSync.reload);
}

// export functions
exports.css = css;
exports.javascript = javascript;
exports.watch = watch;

// gulp
const build = gulp.parallel(watch);
gulp.task("default", build);
