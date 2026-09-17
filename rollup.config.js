import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default {
  input: "src/index.tsx",
  external: [/^date-fns/],
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.build.json",
      declaration: true,
      declarationDir: "build",
    }),
    postcss({ use: [["sass", { silenceDeprecations: ["legacy-js-api"] }]] }),
  ],
};
