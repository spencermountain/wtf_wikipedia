import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import { toOrdinal } from '../_lib.ts'
import languageNames from '../../_data/language-names.ts'

// Harvard-style inline citations - unlike {{sfn}}, these are visible prose
// https://en.wikipedia.org/wiki/Template:Harvard_citation
const harvParts = (tmpl, parse) => {
  let obj = parse(tmpl)
  let arr = (obj.list || []).filter((s) => s)
  let year = ''
  // the year is the last positional argument, after up to four authors
  if (arr.length > 1 && /^[0-9]{4}[a-z]?$|^n\.d\.$/i.test(arr.at(-1))) {
    year = arr.pop()
  } else if (arr.length > 4) {
    year = arr.pop()
  }
  let authors = ''
  if (arr.length === 1) {
    authors = arr[0]
  } else if (arr.length === 2) {
    authors = `${arr[0]} & ${arr[1]}`
  } else if (arr.length === 3) {
    authors = `${arr[0]}, ${arr[1]} & ${arr[2]}`
  } else if (arr.length >= 4) {
    authors = `${arr[0]} et al.`
  }
  let loc = ''
  if (obj.p) {
    loc = `p. ${obj.p}`
  } else if (obj.pp) {
    loc = `pp. ${obj.pp}`
  } else if (obj.loc) {
    loc = obj.loc
  }
  return { authors, year, loc }
}
// (Smith 2001, p. 12)
const harv = (tmpl, parse = defaultParse) => {
  let { authors, year, loc } = harvParts(tmpl, parse)
  let str = [authors, year].filter((s) => s).join(' ')
  if (loc) {
    str += `, ${loc}`
  }
  return { data: null, replacement: `(${str})` }
}
// Smith (2001, p. 12)
const harvtxt = (tmpl, parse = defaultParse) => {
  let { authors, year, loc } = harvParts(tmpl, parse)
  let inside = [year, loc].filter((s) => s).join(', ')
  let str = authors
  if (inside) {
    str += ` (${inside})`
  }
  return { data: null, replacement: str.trim() }
}
// Smith 2001, p. 12
const harvnb = (tmpl, parse = defaultParse) => {
  let { authors, year, loc } = harvParts(tmpl, parse)
  let str = [authors, year].filter((s) => s).join(' ')
  if (loc) {
    str += `, ${loc}`
  }
  return { data: null, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:Section_link
// {{section link|Foo|Bar|Baz}} → Foo § Bar and § Baz
const sectionLink = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let arr = obj.list || []
  let page = (arr[0] || '').trim()
  let sections = arr.slice(1).filter((s) => s)
  if (sections.length === 0) {
    return { data: null, replacement: page }
  }
  let secs = sections.map((s) => `§ ${s}`)
  let str = secs.length > 1 ? secs.slice(0, -1).join(', ') + ' and ' + secs.at(-1) : secs[0]
  if (page) {
    if (obj.nopage === 'y' || obj.nopage === 'yes') {
      return { data: null, replacement: str }
    }
    return { data: null, replacement: `[[${page}#${sections[0]}|${page} ${str}]]` }
  }
  return { data: null, replacement: str }
}

// https://en.wikipedia.org/wiki/Template:Crossreference - {{crossref|see Foo}} → (see Foo)
const crossreference = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  let text = (obj.text || obj.printworthy || '').trim()
  if (!text || /^\(.*\)$/.test(text)) {
    return { data: null, replacement: text }
  }
  return { data: null, replacement: `(${text})` }
}

// https://en.wikipedia.org/wiki/Template:Née - {{née|Smith}} → née Smith
const nee = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name'])
  let word = /^n[ée]$/.test(obj.template || '') ? 'né' : 'née'
  if (obj.name) {
    return { data: null, replacement: `${word} ${obj.name}` }
  }
  return { data: null, replacement: word }
}

// https://en.wikipedia.org/wiki/Template:" - {{"|text}} → "text"
const quotes = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  if (obj.text) {
    return { data: null, replacement: `"${obj.text}"` }
  }
  return { data: null, replacement: '"' }
}

// https://en.wikipedia.org/wiki/Template:Ordinal - {{ordinal|3}} → 3rd
const ordinal = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num'])
  let n = Number(obj.num)
  if (!Number.isFinite(n)) {
    return { data: null, replacement: obj.num || '' }
  }
  return { data: null, replacement: toOrdinal(n) }
}

// https://en.wikipedia.org/wiki/Template:Spell - {{spell|3}} → three
const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const spellOut = (n) => {
  if (n < 20) {
    return ones[n]
  }
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '')
  }
  if (n < 1000) {
    return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + spellOut(n % 100) : '')
  }
  if (n < 1000000) {
    return spellOut(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + spellOut(n % 1000) : '')
  }
  return String(n)
}
const spell = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['num'])
  let n = Number(obj.num)
  if (!Number.isInteger(n) || n < 0 || n >= 1000000) {
    return { data: null, replacement: obj.num || '' }
  }
  return { data: null, replacement: spellOut(n) }
}

// https://en.wikipedia.org/wiki/Template:Arrow - {{arrow|right}} → →
const arrows = { right: '→', left: '←', up: '↑', down: '↓', 'left-right': '↔', 'up-down': '↕', ne: '↗', nw: '↖', se: '↘', sw: '↙', r: '→', l: '←', u: '↑', d: '↓' }
const arrow = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['dir'])
  return { data: null, replacement: arrows[(obj.dir || 'right').toLowerCase()] || '→' }
}

// https://en.wikipedia.org/wiki/Template:Cslist - {{cslist|a|b|c}} → a, b, c
const cslist = (tmpl, parse = defaultParse) => {
  let arr = (parse(tmpl).list || []).filter((s) => s)
  return { data: null, replacement: arr.join(', ') }
}

// simple case transforms
const allcaps = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: (obj.text || '').toUpperCase() }
}
const sentenceCase = (tmpl, parse = defaultParse) => {
  let text = (parse(tmpl, ['text']).text || '').toLowerCase()
  return { data: null, replacement: text.charAt(0).toUpperCase() + text.substring(1) }
}
const trim = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: (obj.text || '').trim() }
}

// https://en.wikipedia.org/wiki/Template:Nbsp - {{nbsp|3}} → three non-breaking spaces
const nbsp = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['n'])
  let n = Number(obj.n) || 1
  return { data: null, replacement: ' '.repeat(Math.min(n, 100)) }
}

// https://en.wikipedia.org/wiki/Template:Wikt-lang - {{wikt-lang|fr|word}} → word
const wiktLang = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['code', 'text', 'display'])
  return { data: null, replacement: obj.display || obj.text || '' }
}

// https://en.wikipedia.org/wiki/Template:Linktext - {{linktext|東|京}} → 東京
const linktext = (tmpl, parse = defaultParse) => {
  let arr = (parse(tmpl).list || []).filter((s) => s)
  return { data: null, replacement: arr.join('') }
}

// https://en.wikipedia.org/wiki/Template:Tlx - {{tlx|cite web|url}} → cite web (like {{tl}})
const tlx = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['name'])
  return { data: null, replacement: obj.name || '' }
}

// https://en.wikipedia.org/wiki/Template:In_lang - {{in lang|fr|de}} → (in French and German)
const inLang = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let codes = (obj.list || []).map((s) => s.trim().toLowerCase()).filter((s) => s)
  let names = codes.map((c) => languageNames[c] || languageNames[c.split('-')[0]] || c)
  if (names.length === 0) {
    return { data: null, replacement: '' }
  }
  let str = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0]
  return { data: { codes }, replacement: `(in ${str})` }
}

// https://en.wikipedia.org/wiki/Template:Clickable_button - {{clickable button|Jump to list}} → Jump to list
const clickableButton = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: obj.text || obj.label || '' }
}

// https://en.wikipedia.org/wiki/Template:Box - an inline or block box around its text
const box = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: null, replacement: obj['1'] || obj.text || '' }
}

// https://en.wikipedia.org/wiki/Template:Cl - {{cl|Foo}} → Category:Foo, linked
const categoryLink = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['category', 'text'])
  if (!obj.category) {
    return { data: null, replacement: '' }
  }
  let name = obj.category.replace(/^category:/i, '')
  return { data: null, replacement: `[[:Category:${name}|${obj.text || 'Category:' + name}]]` }
}

export default {
  'in lang': inLang,
  'clickable button': clickableButton,
  box,
  cl: categoryLink,
  tlx,
  harv,
  harvtxt,
  'harvard citation no brackets': harvnb,
  'section link': sectionLink,
  crossreference,
  nee,
  '"': quotes,
  ordinal,
  spell,
  arrow,
  cslist,
  allcaps,
  'sentence case': sentenceCase,
  trim,
  nbsp,
  'wikt-lang': wiktLang,
  linktext,
}
