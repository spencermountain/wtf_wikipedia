import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import sizeCheck from 'rollup-plugin-filesize-check'

export default function pluginBuild(configUrl, options) {
  const { name, version } = JSON.parse(readFileSync(new URL('./package.json', configUrl), 'utf8'))
  const file = (relative) => fileURLToPath(new URL(relative, configUrl))
  const banner = `/*! ${name} ${version} MIT */`
  const plugins = []
  if (options.resolve) plugins.push(nodeResolve())
  plugins.push(options.transpile ? esbuild({ target: 'es2018' }) : commonjs(options.commonjs))
  return {
    input: file('src/index.js'),
    plugins,
    output: [
      { banner, file: file(`builds/${name}.mjs`), format: 'esm' },
      { banner, file: file(`builds/${name}.cjs`), format: 'cjs' },
      {
        banner,
        file: file(`builds/${name}.min.js`),
        format: 'umd',
        name: options.global,
        plugins: [terser(), ...(options.size > 0 ? [sizeCheck(options.size)] : [])],
      },
    ],
  }
}
