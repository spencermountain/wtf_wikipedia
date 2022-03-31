import fs from 'fs'
import path from 'path'
import wtf from '../../src/index.js'

function from_file(page, options) {
  let file = '../cache/' + page + '.txt'
  file = path.join(__dirname, file)
  const str = fs.readFileSync(file, 'utf-8')
  return wtf(str, options)
}
export default from_file
