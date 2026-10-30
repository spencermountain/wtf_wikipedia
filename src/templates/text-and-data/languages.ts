import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

// {{lang-xx}} renders without its 'French:' label, so these follow suit

// https://en.wikipedia.org/wiki/Template:Langx - the 2024 replacement for every {{lang-xx}}
// {{langx|ar|العربية|al-ʿarabiyya|lit=Arabic}} → العربية, al-ʿarabiyya, lit. 'Arabic'
const langx = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['code', 'text', 'translit', 'lit'])
  let translit = obj.translit || obj.transliteration || ''
  let lit = obj.lit || obj.translation || ''
  let parts = [obj.text || '', translit]
  if (lit) {
    parts.push(`lit. '${lit}'`)
  }
  parts = parts.filter((s) => s)
  const payload: any = { template: 'langx', lang: obj.code, text: obj.text || '' }
  if (translit) {
    payload.translit = translit
  }
  if (lit) {
    payload.lit = lit
  }
  return { data: payload, replacement: parts.join(', ') }
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

export default {
  langx,
  zh,
  korean,
  ruby,
  respell,
  'post-nominals': postNominals,
}
