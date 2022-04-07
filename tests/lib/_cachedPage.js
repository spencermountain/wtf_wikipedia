import fs from 'fs'
import path from 'path'
import wtf from '../../src/index.js'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

function from_file(page, options) {
  let file = '../cache/' + page + '.txt'
  file = path.join(dir, file)
  const str = fs.readFileSync(file, 'utf-8')
  return wtf(str, options)
}
export default from_file
