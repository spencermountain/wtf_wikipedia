import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import sizeCheck from 'rollup-plugin-filesize-check'

const banner = '/*! spencermountain/wtf_wikipedia  MIT */'

export default {
  input: 'src/index.ts',
  plugins: [esbuild({ target: 'es2022' })],
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
      plugins: [
        terser(),
        sizeCheck({
          expect: 141,
          warn: 10, // acceptable (+/-)
          throw: 25, // unacceptable (+/-)
        }),
      ],
    },
    {
      banner,
      file: 'builds/wtf_wikipedia-client.mjs',
      format: 'esm',
      plugins: [terser()],
    },
  ],
}
