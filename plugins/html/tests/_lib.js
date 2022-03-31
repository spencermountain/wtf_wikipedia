/* eslint-disable no-console */
import build from '../../../builds/wtf_wikipedia.mjs'
import src from '../../../src/index.js'
import plgSrc from '../src/index.js'
import plgBuild from '../builds/wtf-plugin-html.mjs'

let lib = src
if (process.env.TESTENV === 'prod') {
  console.warn('== production build test 🚀 ==')
  lib = build
  lib.plugin(plgBuild)
} else {
  lib.plugin(plgSrc)
}
export default lib
