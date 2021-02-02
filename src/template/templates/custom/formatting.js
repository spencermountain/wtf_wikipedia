const parse = require('../../parse/toJSON')
const getLang = require('./_lib').getLang

module.exports = {
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

  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let str = ''
    if (obj.title) {
      str += `'''${obj.title}'''` + '\n\n'
    }
    if (!obj.list) {
      obj.list = []
      for (let i = 1; i < 10; i += 1) {
        if (obj[i]) {
          obj.list.push(obj[i])
          delete obj[i]
        }
      }
    }
    obj.list = obj.list.filter((s) => s)
    str += obj.list.join('\n\n')
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, list) => {
    let arr = parse(tmpl).list || []
    let str = arr[0] || ''
    let lines = str.split(/\n/).filter((f) => f)
    lines = lines.map((s) => s.replace(/\*/, ''))
    list.push({
      template: 'columns-list',
      list: lines,
    })
    lines = lines.map((s) => '• ' + s)
    return lines.join('\n\n')
  },

  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let result = []
    let units = ['m', 'cm', 'ft', 'in'] //order matters
    units.forEach((unit) => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit)
      }
    })
    return result.join(' ')
  },

  quote: (tmpl, list) => {
    let order = ['text', 'author']
    let obj = parse(tmpl, order)
    list.push(obj)
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`
      if (obj.author) {
        str += '\n\n'
        str += `    - ${obj.author}`
      }
      return str + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, list) => {
    let obj = parse(tmpl, ['one', 'two', 'three'])
    let word = (obj.one || '') + (obj.two || '')
    //support '[sic?]'
    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '')
    }
    list.push({
      template: 'sic',
      word: word,
    })
    if (obj.nolink === 'y') {
      return word
    }
    return `${word} [sic]`
  },

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
}
