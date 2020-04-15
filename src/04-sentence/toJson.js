const setDefaults = require('../_lib/setDefaults')
const isNumber = /^[0-9,.]+$/

const defaults = {
  text: true,
  links: true,
  formatting: true,
  numbers: true,
}

const toJSON = function (s, options) {
  options = setDefaults(options, defaults)
  let data = {}
  let text = s.text()
  if (options.text === true) {
    data.text = text
  }
  //add number field
  if (options.numbers === true && isNumber.test(text)) {
    let num = Number(text.replace(/,/g, ''))
    if (isNaN(num) === false) {
      data.number = num
    }
  }
  if (options.links && s.links().length > 0) {
    data.links = s.links().map((l) => l.json())
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt
  }
  return data
}
module.exports = toJSON
