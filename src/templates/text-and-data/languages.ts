import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

import languageNames from '../../_data/language-names.ts'

// 'French: bonjour, romanized: x, lit. 'y'' - as wikipedia renders {{langx}} and {{lang-xx}}
const langText = (code = '', obj: any = {}) => {
  code = code.toLowerCase()
  let label = obj.label
  if (label === undefined) {
    label = languageNames[code] || languageNames[code.split('-')[0]] || ''
  }
  let translit = obj.translit || obj.transliteration || ''
  let lit = obj.lit || obj.translation || ''
  let str = obj.text || ''
  if (label && label !== 'none') {
    str = `${label}: ${str}`
  }
  if (translit) {
    str += `, romanized: ${translit}`
  }
  if (lit) {
    str += `, lit. '${lit}'`
  }
  return str
}

// https://en.wikipedia.org/wiki/Template:Langx - the 2024 replacement for every {{lang-xx}}
// {{langx|ar|العربية|al-ʿarabiyya|lit=Arabic}} → Arabic: العربية, romanized: al-ʿarabiyya, lit. 'Arabic'
const langx = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['code', 'text', 'translit', 'lit'])
  const payload: any = { template: 'langx', lang: obj.code, text: obj.text || '' }
  if (obj.translit || obj.transliteration) {
    payload.translit = obj.translit || obj.transliteration
  }
  if (obj.lit || obj.translation) {
    payload.lit = obj.lit || obj.translation
  }
  return { data: payload, replacement: langText(obj.code, obj) }
}

// {{lang-fr|bonjour}} → French: bonjour  (the code comes from the template name)
const langDash = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'translit', 'lit'])
  let code = (obj.template || '').replace(/^lang-/, '')
  // {{lang-sr-cyrl-latn|cyrillic|latin}} gives both scripts
  if (/-(cyrl?|latn)-(cyrl|latn)$/.test(code)) {
    code = code.replace(/-(cyrl|latn)$/, '')
  }
  return { data: null, replacement: langText(code, obj) }
}

// https://en.wikipedia.org/wiki/Template:Zh
// {{zh|c=北京|p=Běijīng}} → Chinese: 北京; pinyin: Běijīng
const zhOrder = [
  ['c', 'Chinese'],
  ['t', 'traditional Chinese'],
  ['s', 'simplified Chinese'],
  ['p', 'pinyin'],
  ['tp', 'Tongyong Pinyin'],
  ['w', 'Wade–Giles'],
  ['j', 'Jyutping'],
  ['cy', 'Cantonese Yale'],
  ['poj', 'Pe̍h-ōe-jī'],
  ['l', 'lit.'],
]
const zh = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let order = zhOrder
  // first=t puts traditional before simplified (the default); first=s swaps them
  if (obj.first === 's') {
    order = zhOrder.filter((a) => a[0] !== 't' && a[0] !== 's')
    order.splice(1, 0, ['s', 'simplified Chinese'], ['t', 'traditional Chinese'])
  }
  const noLabels = obj.labels === 'no'
  let parts = []
  order.forEach(([key, label]) => {
    if (!obj[key]) {
      return
    }
    if (key === 'l') {
      parts.push(noLabels ? `'${obj[key]}'` : `lit. '${obj[key]}'`)
      return
    }
    parts.push(noLabels ? obj[key] : `${label}: ${obj[key]}`)
  })
  return { data: obj, replacement: parts.join('; ') }
}

// https://en.wikipedia.org/wiki/Template:Korean
// {{Korean|hangul=서울|rr=Seoul}} → Korean: 서울; RR: Seoul
const koOrder = [
  ['hangul', 'Korean'],
  ['hanja', 'Hanja'],
  ['rr', 'RR'],
  ['mr', 'MR'],
  ['yale', 'Yale'],
  ['lit', 'lit.'],
]
const korean = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['hangul', 'hanja', 'rr', 'mr'])
  const noLabels = obj.labels === 'no'
  let parts = []
  koOrder.forEach(([key, label]) => {
    if (!obj[key]) {
      return
    }
    if (key === 'lit') {
      parts.push(noLabels ? `'${obj[key]}'` : `lit. '${obj[key]}'`)
      return
    }
    parts.push(noLabels ? obj[key] : `${label}: ${obj[key]}`)
  })
  return { data: obj, replacement: parts.join('; ') }
}

// https://en.wikipedia.org/wiki/Template:Ruby - {{ruby|東京|とうきょう}} → 東京 (とうきょう)
const ruby = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text', 'ruby'])
  if (obj.ruby) {
    return { data: obj, replacement: `${obj.text || ''} (${obj.ruby})` }
  }
  return { data: obj, replacement: obj.text || '' }
}

// https://en.wikipedia.org/wiki/Template:Respell - a pronunciation guide, omitted like {{IPA}}
// {{respell|EYE|pee|AY}} → EYE-pee-AY
const respell = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let arr = (obj.list || []).map((s) => (s === '_' ? ' ' : s))
  let str = arr.join('-').replace(/-? -?/g, ' ')
  return { data: { template: 'respell', transcription: str }, replacement: '' }
}

// https://en.wikipedia.org/wiki/Template:Post-nominals - {{post-nominals|country=GBR|OBE|FRS}} → OBE FRS
const postNominals = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let arr = (obj.list || []).filter((s) => s)
  if (obj.post && obj.post !== undefined) {
    arr = obj.post.split(/[, ]+/).filter((s) => s)
  }
  return { data: { template: 'post-nominals', list: arr, country: obj.country }, replacement: arr.join(obj.sep || ' ') }
}

export { langDash }
export default {
  langx,
  zh,
  korean,
  ruby,
  respell,
  'post-nominals': postNominals,
}
