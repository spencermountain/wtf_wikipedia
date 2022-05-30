/* eslint-disable no-console */
import build from '../../../builds/wtf_wikipedia.mjs'
import src from '../../../src/index.js'
import { nhl, mlb } from '../src/index.js'
// import {mlb} from '../../builds/wtf-plugin-sports.mjs'

let lib = src
if (process.env.TESTENV === 'prod') {
  console.warn('== production build test 🚀 ==')
  lib = build
  lib.plugin(mlb)
  lib.plugin(nhl)
} else {
  lib.plugin(mlb)
  lib.plugin(nhl)
}
export default lib
