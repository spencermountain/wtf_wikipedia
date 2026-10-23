const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  signature_alt: true
}

const defaults = {
  images: true
}

//
import pad from './_lib/pad.js'

// render an infobox as a table with two columns, key + value
const doInfobox = function (Sentence, options) {
  options = { ...defaults, ...options }
  const data = this.json().data
  let md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n'
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n'
  //todo: render top image here (somehow)
  Object.keys(data).forEach((k) => {
    if (dontDo[k] === true) {
      return
    }
    const key = '**' + k + '**'
    const blocks = [].concat(data[k])
    let val = blocks.map((block) => new Sentence(block).markdown(options)).join(' ')
    //markdown is more newline-sensitive than wiki
    val = val.replaceAll('\n', ', ')
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n'
  })
  return md
}
export default doInfobox
