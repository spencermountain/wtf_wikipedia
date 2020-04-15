const fs = require('fs')
const path = require('path')
var wtf = require('../../src/index')
wtf.extend(require('./src'))

let abs = path.join(__dirname, './tests/texts.txt')
let arr = fs
  .readFileSync(abs)
  .toString()
  .split(/\n/)
  .filter((s) => s)
arr.forEach((txt) => {
  let str = wtf(txt).summary({ template: false, sentence: false })
  console.log(str)
})
