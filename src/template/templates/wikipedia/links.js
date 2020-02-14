const parse = require('../../_parsers/parse')

let templates = {
  /* mostly wiktionary*/
  etyl: tmpl => {
    let order = ['lang', 'page']
    return parse(tmpl, order).page || ''
  },
  mention: tmpl => {
    let order = ['lang', 'page']
    return parse(tmpl, order).page || ''
  },
  link: tmpl => {
    let order = ['lang', 'page']
    return parse(tmpl, order).page || ''
  },
  'la-verb-form': tmpl => {
    let order = ['word']
    return parse(tmpl, order).word || ''
  },
  'la-ipa': tmpl => {
    let order = ['word']
    return parse(tmpl, order).word || ''
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: tmpl => {
    let order = ['first', 'last', 'target', 'sort']
    let obj = parse(tmpl, order)
    let name = `${obj.first || ''} ${obj.last || ''}`
    name = name.trim()
    if (obj.nolink) {
      return obj.target || name
    }
    if (obj.dab) {
      name += ` (${obj.dab})`
      if (obj.target) {
        obj.target += ` (${obj.dab})`
      }
    }
    if (obj.target) {
      return `[[${obj.target}|${name}]]`
    }
    return `[[${name}]]`
  }
}

//these are insane
// https://en.wikipedia.org/wiki/Template:Tl
const links = [
  'lts',
  't',
  'tfd links',
  'tiw',
  'tltt',
  'tetl',
  'tsetl',
  'ti',
  'tic',
  'tiw',
  'tlt',
  'ttl',
  'twlh',
  'tl2',
  'tlu',
  'demo',
  'hatnote',
  'xpd',
  'para',
  'elc',
  'xtag',
  'mli',
  'mlix',
  '#invoke',
  'url' //https://en.wikipedia.org/wiki/Template:URL
]

//keyValues
links.forEach(k => {
  templates[k] = tmpl => {
    let order = ['first', 'second']
    let obj = parse(tmpl, order)
    return obj.second || obj.first
  }
})
//aliases
templates.m = templates.mention
templates['m-self'] = templates.mention
templates.l = templates.link
templates.ll = templates.link
templates['l-self'] = templates.link
module.exports = templates
