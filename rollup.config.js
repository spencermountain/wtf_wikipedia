import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'

const banner = '/*! wtf_wikipedia  MIT */'

export default {
  input: 'src/index.ts',
  plugins: [esbuild({ target: 'es2018' })],
  output: [
    {
      banner,
      file: 'builds/wtf_wikipedia.mjs',
      format: 'esm',
    },
    {
      banner,
      file: 'builds/wtf_wikipedia.cjs',
      format: 'cjs',
    },
    {
      banner,
      file: 'builds/wtf_wikipedia-client.min.js',
      format: 'umd',
      name: 'wtf',
      plugins: [terser()],
    },
    {
      banner,
      file: 'builds/wtf_wikipedia-client.mjs',
      format: 'esm',
      plugins: [terser()],
    },
  ],
}
