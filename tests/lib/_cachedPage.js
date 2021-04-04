const fs = require('fs')
const path = require('path')
const wtf = require('../../src/index')

function from_file(page, options) {
  let file = '../cache/' + page + '.txt'
  file = path.join(__dirname, file)
  const str = fs.readFileSync(file, 'utf-8')
  return wtf(str, options)
}
module.exports = from_file
