/* eslint-disable no-console */
import build from '../../builds/wtf_wikipedia.mjs'
import src from '../../src/index.js'
let lib = src
if (process.env.TESTENV === 'prod') {
  console.warn('== production build test 🚀 ==')
  lib = build
}
export default lib
