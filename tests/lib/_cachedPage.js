var fs = require('fs');
var wtf = require('../../src/index');

function from_file(page, options) {
  var str = fs.readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  return wtf(str, options);
}
module.exports = from_file;
