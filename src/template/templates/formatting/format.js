const parse = require('../../_parsers/parse')

let templates = {
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl) => {
    let obj = parse(tmpl, ['tag', 'open'])
    const ignore = {
      span: true,
      div: true,
      p: true,
    }
    //pair, empty, close, single
    if (!obj.open || obj.open === 'pair') {
      //just skip generating spans and things..
      if (ignore[obj.tag]) {
        return obj.content || ''
      }
      return `<${obj.tag} ${obj.attribs || ''}>${obj.content || ''}</${obj.tag}>`
    }
    return ''
  },
  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: (tmpl) => {
    tmpl = tmpl.replace(/plural:/, 'plural|')
    let order = ['num', 'word']
    let obj = parse(tmpl, order)
    let num = Number(obj.num)
    let word = obj.word
    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, 'ies')
      } else {
        word += 's'
      }
    }
    return num + ' ' + word
  },
  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': (tmpl) => {
    let obj = parse(tmpl, ['text'])
    let str = obj.text
    if (obj.sep) {
      return str.split(obj.sep)[0]
    }
    return str.split(' ')[0]
  },
  trunc: (tmpl) => {
    let order = ['str', 'len']
    let obj = parse(tmpl, order)
    return obj.str.substr(0, obj.len)
  },
  'str mid': (tmpl) => {
    let order = ['str', 'start', 'end']
    let obj = parse(tmpl, order)
    let start = parseInt(obj.start, 10) - 1
    let end = parseInt(obj.end, 10)
    return obj.str.substr(start, end)
  },
  //grab the first, second or third pipe
  p1: 0,
  p2: 1,
  p3: 2,
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl) => {
    let obj = parse(tmpl, ['text'])
    let attrs = ''
    if (obj.list) {
      attrs = '|' + obj.list.join('|')
    }
    return '{{' + (obj.text || '') + attrs + '}}'
  },
  nobold: 0,
  noitalic: 0,
  nocaps: 0,
  syntaxhighlight: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return obj.code || ''
  },
  samp: (tmpl, list) => {
    let obj = parse(tmpl, ['1'])
    list.push(obj)
    return obj['1'] || ''
  },
  //https://en.wikipedia.org/wiki/Template:Visible_anchor
  vanchor: 0,
  //https://en.wikipedia.org/wiki/Template:Resize
  resize: 1,
  //https://en.wikipedia.org/wiki/Template:Ra
  ra: (tmpl) => {
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },
  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: (tmpl) => {
    //this template should do the conversion
    let obj = parse(tmpl, ['degrees'])
    return (obj.degrees || '') + '°'
  },
  hms2deg: (tmpl) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },
  decdeg: (tmpl) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd'])
    return (obj.deg || obj.degrees) + '°'
  },
  rnd: 0,
  //https://en.wikipedia.org/wiki/Template:DEC
  dec: (tmpl) => {
    let obj = parse(tmpl, ['degrees', 'minutes', 'seconds'])
    let str = (obj.degrees || 0) + '°'
    if (obj.minutes) {
      str += obj.minutes + `′`
    }
    if (obj.seconds) {
      str += obj.seconds + '″'
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Val
  val: (tmpl) => {
    let obj = parse(tmpl, ['number', 'uncertainty'])
    let num = obj.number
    if (num && Number(num)) {
      num = Number(num).toLocaleString()
    }
    let str = num || ''
    //prefix/suffix
    if (obj.p) {
      str = obj.p + str
    }
    if (obj.s) {
      str = obj.s + str
    }
    //add units, too
    if (obj.u || obj.ul || obj.upl) {
      str = str + ' ' + (obj.u || obj.ul || obj.upl)
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Sub
  sub: (tmpl, list) => {
    let obj = parse(tmpl, ['text'])
    list.push(obj)
    return obj.text || ''
  },
  //https://en.wikipedia.org/wiki/Template:Sup
  sup: (tmpl, list) => {
    let obj = parse(tmpl, ['text'])
    list.push(obj)
    return obj.text || ''
  },
}

//aliases
templates['rndfrac'] = templates.rnd
templates['rndnear'] = templates.rnd
templates['unité'] = templates.val

//templates that we simply grab their insides as plaintext
let inline = [
  'nowrap',
  'nobr',
  'big',
  'cquote',
  'pull quote',
  'small',
  'smaller',
  'midsize',
  'larger',
  'big',
  'kbd',
  'bigger',
  'large',
  'mono',
  'strongbad',
  'stronggood',
  'huge',
  'xt',
  'xt2',
  '!xt',
  'xtn',
  'xtd',
  'dc',
  'dcr',
  'mxt',
  '!mxt',
  'mxtn',
  'mxtd',
  'bxt',
  '!bxt',
  'bxtn',
  'bxtd',
  'delink', //https://en.wikipedia.org/wiki/Template:Delink
  //half-supported
  'pre',
  'var',
  'mvar',
  'pre2',
  'code',
]
inline.forEach((k) => {
  templates[k] = (tmpl) => {
    return parse(tmpl, ['text']).text || ''
  }
})

module.exports = templates
