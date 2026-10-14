import wtf from './index.js'
import { readPage } from '../_examples/index.js'

const fromFile = (page, options) => wtf(readPage(page), options)

export default fromFile
