import { merger, build_SASS_rollup,build_rollup } from "merger-client-static-jsx";

// await build_SASS_rollup({
//   mainSASS: "./theme/scss/abrevs.scss",
//   outCSS: "./theme/css/main-sass.css",
// });

await build_rollup();

merger({
  folderRoot: "./static/jsx",
  output: "./static/js/appdoc.client.merged.min.js",
});
