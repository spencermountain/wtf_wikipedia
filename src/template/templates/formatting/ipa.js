const parse = require('../../_parsers/parse')
const getLang = require('./_lib').getLang

// pronounciation info
let templates = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, list) => {
    let obj = parse(tmpl, ['transcription', 'lang', 'audio'])
    obj.lang = getLang(obj.template)
    obj.template = 'ipa'
    list.push(obj)
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, list) => {
    let obj = parse(tmpl)
    obj.transcription = (obj.list || []).join(',')
    delete obj.list
    obj.lang = getLang(obj.template)
    obj.template = 'ipac'
    list.push(obj)
    return ''
  },
  transl: (tmpl, list) => {
    let obj = parse(tmpl, ['lang', 'text', 'text2'])
    // support 3-param
    if (obj.text2) {
      obj.iso = obj.text
      obj.text = obj.text2
      delete obj.text2
    }
    list.push(obj)
    return obj.text || ''
  },
}

module.exports = templates
