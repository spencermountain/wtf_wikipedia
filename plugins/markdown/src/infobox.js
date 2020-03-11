const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  'signature alt': true
}

const defaults = {
  images: true
}

//
const pad = require('./_lib/pad')

// render an infobox as a table with two columns, key + value
const doInfobox = function(options) {
  options = Object.assign({}, defaults, options)
  let md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n'
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n'
  //todo: render top image here (somehow)
  Object.keys(this.data).forEach(k => {
    if (dontDo[k] === true) {
      return
    }
    let key = '**' + k + '**'
    let s = this.data[k]
    let val = s.markdown(options)
    //markdown is more newline-sensitive than wiki
    val = val.split(/\n/g).join(', ')
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n'
  })
  return md
}
module.exports = doInfobox
