import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'

console.log('\n 📦  - running rollup..\n')

const banner = '/*! wtf_wikipedia  MIT */'
export default [
  // === server-side .mjs ===
  {
    input: 'src/index.ts',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia.mjs', format: 'esm' }],
    plugins: [esbuild({ target: 'es2018' })],
  },

  // === server-side .js ===
  {
    input: 'src/index.ts',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia.cjs', format: 'umd', name: 'wtf' }],
    plugins: [esbuild({ target: 'es2018' })],
  },

  // === client-side min.js ===
  {
    input: 'src/index.ts',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia-client.min.js', format: 'umd', name: 'wtf', sourcemap: false }],
    plugins: [esbuild({ target: 'es2018' }), terser()],
  },
  // === client-side .mjs ===
  {
    input: 'src/index.ts',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia-client.mjs', format: 'esm', name: 'wtf', sourcemap: false }],
    plugins: [esbuild({ target: 'es2018' }), terser()],
  },
]
