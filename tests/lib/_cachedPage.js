import fs from 'node:fs'
import path from 'node:path'
import wtf from '../../src/index.ts'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))

function from_file(page, options) {
  let file = '../cache/' + page + '.txt'
  file = path.join(dir, file)
  // eslint-disable-next-line
  const str = fs.readFileSync(file, 'utf8')
  return wtf(str, options)
}
export default from_file
