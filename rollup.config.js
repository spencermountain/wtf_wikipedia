import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import alias from '@rollup/plugin-alias'
import sizeCheck from 'rollup-plugin-filesize-check'

import { version } from './package.json'
console.log('\n 📦  - running rollup..\n')

const banner = '/* wtf_wikipedia ' + version + ' MIT */'
export default [
  // === server-side .mjs (typescript)===
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/wtf_wikipedia.mjs', format: 'esm' }],
    external: ['https'],
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
    ],
  },

  // === server-side .js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf_wikipedia.js',
        format: 'umd',
        name: 'wtf',
        globals: { https: 'https' },
      },
    ],
    external: ['https'],
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
    ],
  },

  /// ======================
  // === client-side .js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf_wikipedia-client.js',
        format: 'umd',
        name: 'wtf',
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
      alias({
        entries: [
          { find: './http/server', replacement: './http/client' },
          { find: './_fetch/http/server', replacement: './_fetch/http/client' },
        ],
      }),
    ],
  },
  // === client-side min.js ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf_wikipedia-client.min.js',
        format: 'umd',
        name: 'wtf',
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
      alias({
        entries: [
          { find: './http/server', replacement: './http/client' },
          { find: './_fetch/http/server', replacement: './_fetch/http/client' },
        ],
      }),
      terser(),
      sizeCheck({ expect: 123, warn: 10 }),
    ],
  },
  // === client-side .mjs ===
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/wtf_wikipedia-client.mjs',
        format: 'esm',
        name: 'wtf',
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
      alias({
        entries: [
          { find: './http/server', replacement: './http/client' },
          { find: './_fetch/http/server', replacement: './_fetch/http/client' },
        ],
      }),
      terser(),
      sizeCheck({ expect: 123, warn: 10 }),
    ],
  },
]
