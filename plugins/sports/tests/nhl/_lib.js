/* eslint-disable no-console */
import build from '../../../../builds/wtf_wikipedia.mjs'
import src from '../../../../src/index.js'
import { nhl } from '../../src/index.js'
// import {nhl} from '../../builds/wtf-plugin-sports.mjs'

let lib = src
if (process.env.TESTENV === 'prod') {
  console.warn('== production build test 🚀 ==')
  lib = build
  lib.plugin(nhl)
} else {
  lib.plugin(nhl)
}
export default lib
