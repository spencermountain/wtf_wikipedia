// const parse = require('../_parsers/parse')

const templates = {
  // https://en.wikivoyage.org/wiki/Template:Do
  listing: (tmpl, list, parser) => {
    let obj = parser(tmpl, [])
    list.push(obj)
    // flatten it all into one line of text
    let name = obj.name
    if (obj.url) {
      name = `[${obj.url} ${obj.name}]`
    }
    let phone = ''
    if (obj.phone) {
      phone = `[tel:${obj.phone}]`
    }
    let updated = ''
    if (obj.lastedit) {
      updated = `(updated ${obj.lastedit})`
    }
    let out = `${name} ${obj.address || ''} ${obj.directions || ''} ${phone} ${obj.hours || ''} ${obj.content} ${
      obj.price
    } ${updated}`
    return out
  },
  // https://en.wikivoyage.org/wiki/Template:Station
  station: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['name'])
    list.push(obj)
    return obj.name || '' //missing some labels
  },
  pagebanner: (tmpl, list, parser) => {
    let obj = parser(tmpl, [
      'image',
      'caption',
      'text',
      'page name',
      'disambiguation',
      'star',
      'DotM',
      'OtBP',
      'Ftt',
      'TOC box',
    ])
    list.push(obj)
  },
  isPartOf: ['place'],
  mapframe: ['lat', 'lng'],
  // phone numbers
  phone: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['number'])
    list.push(obj)
    return obj.number || ''
  },
  kilometer: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['km', 'adj'])
    let num = Number(obj.km) || 0
    let m = num * 0.62137
    m = Math.round(m * 10) / 10
    if (!m) {
      return `${obj.km} km`
    }
    if (obj.adj === 'on' || obj.adj === 'adj') {
      return `${obj.km}-km (${m} mi)`
    }
    return `${obj.km} km (${m} mi)`
  },
  mile: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['mi', 'adj'])
    let num = Number(obj.mi) || 0
    let m = num * 1.609344
    m = Math.round(m * 10) / 10
    if (!m) {
      return `${obj.mi} mi`
    }
    if (obj.adj === 'on' || obj.adj === 'adj') {
      return `${obj.mi}-mile (${m} km)`
    }
    return `${obj.mi} mi (${m} km)`
  },
  related: ['page'],
  seealso: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['article'])
    list.push(obj)
    if (obj.article) {
      return `See also: [[${obj.article}]]`
    }
    return ''
  },
  confused: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['disambig'])
    list.push(obj)
    if (obj.disambig) {
      return `Not to be confused with ${obj.disambig}\n`
    }
    return ''
  },
  'other uses': (tmpl, list, parser) => {
    let obj = parser(tmpl, ['disambig'])
    list.push(obj)
    if (obj.disambig) {
      return `For other places with the same name, see [[${obj.disambig} (disambiguation)]]\n`
    }
    return ''
  },
  relatedwikipedia: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['page'])
    list.push(obj)
    return `[[Wikipedia:${obj.page}]]`
  },
  celsius: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['c'])
    list.push(obj)
    return `${obj.c}°C`
  },
  pound: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['num'])
    list.push(obj)
    return `${obj.num} lb`
  },
  fahrenheit: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['c'])
    list.push(obj)
    return `${obj.c}°F`
  },
  foot: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['num'])
    list.push(obj)
    let num = Number(obj.num)
    if (num) {
      let metres = num / 3.2808
      metres = Math.round(metres * 10) / 10
      return `${obj.num} ft (${metres} m)`
    }
    return `${obj.num} ft`
  },
}
// are these sorta the same?
templates.see = templates.listing
templates.do = templates.listing
templates.buy = templates.listing
templates.eat = templates.listing
templates.drink = templates.listing
templates.sleep = templates.listing
templates.go = templates.listing
templates.km = templates.kilometer
templates.mi = templates.mile
templates.ft = templates.foot
templates.c = templates.celsius
templates.f = templates.fahrenheit
templates.lb = templates.pound
templates.otheruses = templates['other uses']

module.exports = templates
