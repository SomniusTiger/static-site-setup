"use strict";
const gulp = require("gulp"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  log = require("fancy-log"),
  colors = require("ansi-colors"),
  sass = require("gulp-sass"),
  sassLint = require("gulp-sass-lint"),
  cssmin = require("gulp-clean-css"),
  htmllint = require("gulp-htmllint"),
  htmlmin = require("gulp-htmlmin"),
  eslint = require("gulp-eslint"),
  concat = require("gulp-concat"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify");

gulp.task("sassLint", () =>
  gulp.src("src/**/*.s+(a|c)ss")
    .pipe(sassLint({
      configFile: "./.sass-lint.yml"
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

gulp.task("sass", () =>
  gulp.src("src/styles/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/styles"))
);

gulp.task("cssmin", () =>
  gulp.src("dist/styles/main.css")
    .pipe(cssmin())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/styles"))
);

/**
 * Sends a message to the console for every HTML lint error.
 * @param {string} filepath The string representing the file path.
 * @param {array} issues An array of strings representing the issues.
 * @returns {undefined}
 */
function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(issue => {
      log(colors.cyan("[gulp-htmllint] ") + colors.white(`${filepath} [${issue.line}, ${issue.column}]: `) + colors.red(`(${issue.code}) ${issue.msg}`));
    });
    process.exitCode = 1;
  }
}

gulp.task("htmlLint", () =>
  gulp.src(["src/markup/*.html", "src/markup/**/*.html"])
    .pipe(htmllint({}, htmllintReporter))
);

gulp.task("htmlmin", () =>
  gulp.src(["src/markup/*.html", "src/markup/**/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("."))
);

gulp.task("eslint", () =>
  gulp.src(["**/*.js", "!node_modules/**", "!dist/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task("concat", () =>
  gulp.src("src/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.concat.js"))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/scripts"))
);

gulp.task("uglify", () =>
  gulp.src("dist/scripts/main.concat.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("dist/scripts"))
);

// Development Asset Build
gulp.task("build:markup", gulp.series("htmlmin"));
gulp.task("build:styles", () =>
  gulp.src("src/styles/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/styles"))
);
gulp.task("build:scripts", () =>
  gulp.src("src/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.concat.js"))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("dist/scripts"))
);

// Production Asset Build, runs linters before outputting files here
gulp.task("production:markup", gulp.series("htmlLint", "htmlmin"));
gulp.task("production:styles", gulp.series("sassLint", "sass", "cssmin"));
gulp.task("production:scripts", gulp.series("eslint", "concat", "uglify"));

// Lints all relevant files. No errors means you’re all set!
gulp.task("lint", gulp.series("htmlLint", "sassLint", "eslint"));

// Watch scripts for development asset builds
gulp.task("watch:markup", () =>
  gulp.watch("src/**/*.html", gulp.series("build:markup"))
);

gulp.task("watch:styles", () =>
  gulp.watch("src/**/*.scss", gulp.series("build:styles"))
);

gulp.task("watch:scripts", () =>
  gulp.watch("src/**/*.js", gulp.series("build:scripts"))
);

// Defines watch, default, and production build tasks
gulp.task("watch", gulp.parallel("watch:markup", "watch:styles", "watch:scripts"));
gulp.task("default", gulp.series("build:markup", "build:styles", "build:scripts"));
gulp.task("production", gulp.series("production:markup", "production:styles", "production:scripts"));
