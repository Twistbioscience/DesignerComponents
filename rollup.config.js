// Rollup plugins
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";
import rootImport from "rollup-plugin-root-import";
import commonjs from "rollup-plugin-commonjs";

const env = process.env.NODE_ENV;
const config = {
  input: "src/index.js",
  plugins: [
    rootImport({
      // Will first look in `client/src/*` and then `common/src/*`.
      root: `${__dirname}/src`,
      useEntry: "prepend",

      // If we don't find the file verbatim, try adding these extensions
      extensions: ".js"
    }),
    babel({
      plugins: ["external-helpers"]
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    })
  ]
};

if (env === "es" || env === "cjs") {
  config.output = { format: env, indent: false };
  config.external = ["symbol-observable"];
}

if (env === "development" || env === "production") {
  config.output = { format: "umd", name: "DesignerComponents", indent: false };
}

if (env === "production") {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
