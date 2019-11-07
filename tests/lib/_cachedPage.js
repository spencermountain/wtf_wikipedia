var fs = require('fs')
var path = require('path')
var wtf = require('../../src/index')

function from_file(page, options) {
  var file = '../cache/' + page + '.txt'
  file = path.join(__dirname, file)
  var str = fs.readFileSync(file, 'utf-8')
  return wtf(str, options)
}
module.exports = from_file
