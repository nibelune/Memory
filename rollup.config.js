// import des plugins
import commonjs from "@rollup/plugin-commonjs";
import noderesolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import scss from "rollup-plugin-scss";

export default {
  input: "src/app.js",
  output: {
    format: "module",
    file: "public/js/app.js",
  },

  plugins: [
    commonjs(),
    noderesolve(),
    babel({ babelHelpers: "bundled" }),
    terser(),
    scss({ output: "public/css/memory.css", outputStyle: "compressed" }),
  ],
};
