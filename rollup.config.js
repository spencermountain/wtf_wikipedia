import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import alias from '@rollup/plugin-alias'
import sizeCheck from 'rollup-plugin-filesize-check'
import builtins from 'rollup-plugin-node-builtins'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const banner = '/* wtf_wikipedia ' + version + ' MIT */'
export default [
  // === server-side .mjs ===
  // {
  //   input: 'src/index.js',
  //   output: [
  //     { banner: banner, file: 'builds/wtf_wikipedia.mjs', format: 'esm', preferBuiltins: false }
  //   ],
  //   plugins: [
  //     resolve({
  //       browser: true
  //     }),
  //     json(),
  //     commonjs(),
  //     sizeCheck()
  //   ]
  // },
  // // === client-side .mjs ===
  // {
  //   input: 'src/index.js',
  //   output: [
  //     {
  //       banner: banner,
  //       file: 'builds/wtf_wikipedia-client.mjs',
  //       format: 'esm',
  //       preferBuiltins: false
  //     }
  //   ],
  //   plugins: [
  //     resolve({
  //       browser: true
  //     }),
  //     json(),
  //     commonjs(),
  //     alias({
  //       entries: [{ find: './http/server', replacement: __dirname + './http/client' }]
  //     }),
  //     sizeCheck()
  //   ]
  // },

  // === server-side .js ===
  // {
  //   input: '/Users/spencer/mountain/wtf_wikipedia/src/_fetch/index.js', //'src/index.js',
  //   output: [
  //     {
  //       banner: banner,
  //       file: 'builds/wtf_wikipedia.js',
  //       format: 'umd',
  //       sourcemap: true,
  //       name: 'wtf'
  //       // globals: ['https']
  //     }
  //   ],
  //   external: ['https'],
  //   plugins: [
  //     builtins(),
  //     resolve({
  //       browser: true
  //     }),
  //     json(),
  //     commonjs(),
  //     babel({
  //       babelrc: false,
  //       presets: ['@babel/preset-env']
  //     }),
  //     sizeCheck()
  //   ]
  // }
  // === client-side .js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf_wikipedia.min.js',
        format: 'umd',
        name: 'wtf'
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      builtins(),
      json(),
      commonjs(),
      alias({
        entries: [{ find: './http/server', replacement: __dirname + './http/client' }]
      }),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      terser(),
      sizeCheck()
    ]
  }
]
