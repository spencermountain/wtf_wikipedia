import fs from 'fs'
import path from 'path'
import wtf from '../../src/index.js'

const dir = new URL('./', import.meta.url).pathname // eslint-disable-line

function from_file(page, options) {
  let file = '../cache/' + page + '.txt'
  file = path.join(dir, file)
  const str = fs.readFileSync(file, 'utf-8')
  return wtf(str, options)
}
export default from_file
