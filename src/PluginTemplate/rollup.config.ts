import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// @ts-ignore: IT EXISTS YOU MOTHERFUCKER
import { Buffer } from "buffer";
// @ts-ignore: YOU TOO
import { mkdir, readFile, writeFile } from "fs";
// @ts-ignore: YOU TOO
import { basename } from "path";
// @ts-ignore: AND YOU TOO
import * as process from "process";
import { defineConfig, Plugin } from "rollup";
import esbuild from "rollup-plugin-esbuild";

const pluginName = basename(process.cwd());

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: `dist/${pluginName}.js`,
      format: "cjs",
      strict: false,
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({ minify: true, target: "ES2019" }),
    ,
    createPluginJson(),
  ],
});

function createPluginJson(options = {}): Plugin {
  return {
    name: "plugin-info",
    writeBundle: (_) => {
      readFile("./package.json", (err: Error, data: Buffer) => {
        if (err) throw err;
        const info = JSON.parse(String(data));
        const pluginData = {
          "name": pluginName,
          "description": info?.description ?? "No description was provided.",
          "author": info?.author?.name ?? "Unknown",
          "version": info?.version ?? "1.0.0",
        };
        mkdir("./dist/", { recursive: true }, (err: any) => {
          if (err) throw err;
          writeFile(
            `./dist/${pluginName}.json`,
            JSON.stringify(pluginData, null, 4),
            { flag: "w" },
            (_: any) => {},
          );
        });
      });
    },
  };
}
