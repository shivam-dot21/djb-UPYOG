// const { series, src, dest, watch } = require("gulp");
// const clean = require("gulp-clean");
// const postcss = require("gulp-postcss");
// const cleanCSS = require("gulp-clean-css");
// const rename = require("gulp-rename");

// let output = "./dist";
// let nodeModulesDest = "../../../node_modules/@djb25/digit-ui-css/dist"; // 🔥 copies to web/node_modules

// function cleanStyles() {
//   return src(`${output}/*.css`, { read: false, allowEmpty: true }).pipe(clean());
// }

// function styles() {
//   const plugins = [
//     require("postcss-import"),
//     require("tailwindcss"),
//     require("autoprefixer"),
//     require("postcss-preset-env")({
//       stage: 2,
//       autoprefixer: { cascade: false },
//       features: { "custom-properties": true },
//     }),
//   ];

//   return src("src/index.scss").pipe(postcss(plugins)).pipe(rename("index.css")).pipe(dest(output)).pipe(dest(nodeModulesDest)); // 🔥 copy to node_modules
// }

// function minify() {
//   return src(`${output}/index.css`).pipe(cleanCSS()).pipe(rename("index.min.css")).pipe(dest(output)).pipe(dest(nodeModulesDest)); // 🔥 copy minified also
// }

// function watcher() {
//   console.log("👀 Watching SCSS files...");
//   watch("src/**/*.scss", series(styles, minify));
// }

// exports.build = series(cleanStyles, styles, minify);
// exports.watch = watcher;
// exports.default = series(styles, minify);

const { series, src, dest, watch } = require("gulp");
const clean = require("gulp-clean");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const livereload = require("gulp-livereload");

let output = "./dist";

function cleanStyles() {
  return src(`${output}/*.css`, { read: false }).pipe(clean());
}

function styles() {
  const plugins = [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-preset-env")({
      stage: 2,
      autoprefixer: { cascade: false },
      features: { "custom-properties": true },
    }),
    require("cssnano"),
  ];

  return src("src/index.scss")
    .pipe(postcss(plugins)) // Tailwind+Apply+Theme → CSS
    .pipe(rename("index.css"))
    .pipe(dest(output));
}

function minify() {
  return src(`${output}/index.css`).pipe(cleanCSS()).pipe(rename("index.min.css")).pipe(dest(output));
}

function livereloadStyles() {
  livereload.listen();
  watch("src/**/*.scss", series(styles));
}

exports.build = series(cleanStyles, styles, minify);
exports.default = series(styles, minify);
exports.watch = livereloadStyles;
