const parse = require('../../_parsers/parse')

const inline = {
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: tmpl => {
    let order = ['num', 'two', 'three', 'four']
    let obj = parse(tmpl, order)
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return `${obj.num} ${obj.two} ${obj.three} ${obj.four}`
      }
      return `${obj.num} ${obj.two} ${obj.three}`
    }
    return `${obj.num} ${obj.two}`
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: tmpl => {
    let obj = parse(tmpl, ['term'])
    return `${obj.term}:`
  },
  defn: 0,
  //https://en.wikipedia.org/wiki/Template:Linum
  lino: 0,
  linum: tmpl => {
    let obj = parse(tmpl, ['num', 'text'])
    return `${obj.num}. ${obj.text}`
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: tmpl => {
    let order = ['text', 'lan1', 'text1', 'lan2', 'text2']
    let obj = parse(tmpl, order)
    return obj.text
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  frac: tmpl => {
    let order = ['a', 'b', 'c']
    let obj = parse(tmpl, order)
    if (obj.c) {
      return `${obj.a} ${obj.b}/${obj.c}`
    }
    if (obj.b) {
      return `${obj.a}/${obj.b}`
    }
    return `1/${obj.b}`
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let result = []
    let units = ['m', 'cm', 'ft', 'in'] //order matters
    units.forEach(unit => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit)
      }
    })
    return result.join(' ')
  },
  'block indent': tmpl => {
    let obj = parse(tmpl)
    if (obj['1']) {
      return '\n' + obj['1'] + '\n'
    }
    return ''
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

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: tmpl => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`
  },
  //Foo-class
  lbc: tmpl => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`
  },
  lbb: tmpl => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}]]`
  },
  // https://en.wikipedia.org/wiki/Template:Own
  own: tmpl => {
    let obj = parse(tmpl, ['author'])
    let str = 'Own work'
    if (obj.author) {
      str += ' by ' + obj.author
    }
    return str
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
      word: word
    })
    if (obj.nolink === 'y') {
      return word
    }
    return `${word} [sic]`
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['number'])
    let str = obj.number || ''
    str = str.replace(/,/g, '')
    let num = Number(str)
    return num.toLocaleString() || ''
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['date', 'format'])
    return obj.date
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toLowerCase()
  },
  lcfirst: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    let text = obj.text
    if (!text) {
      return ''
    }
    return text[0].toLowerCase() + text.substr(1)
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toUpperCase()
  },
  ucfirst: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    let text = obj.text
    if (!text) {
      return ''
    }
    return text[0].toUpperCase() + text.substr(1)
  },
  padleft: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padStart(obj.num, obj.str || '0')
  },
  padright: tmpl => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padEnd(obj.num, obj.str || '0')
  },
  //abbreviation/meaning
  //https://en.wikipedia.org/wiki/Template:Abbr
  abbr: tmpl => {
    let obj = parse(tmpl, ['abbr', 'meaning', 'ipa'])
    return obj.abbr
  },
  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: tmpl => {
    let obj = parse(tmpl, ['abbr', 'page'])
    if (obj.page) {
      return `[[${obj.page}|${obj.abbr}]]`
    }
    return `[[${obj.abbr}]]`
  },
  //https://en.wikipedia.org/wiki/Template:Hover_title
  //technically 'h:title'
  h: 1,
  //https://en.wikipedia.org/wiki/Template:Finedetail
  finedetail: 0,
  //https://en.wikipedia.org/wiki/Template:Sort
  sort: 1
}

//aliases
inline['str left'] = inline.trunc
inline['str crop'] = inline.trunc
inline['tooltip'] = inline.abbr
inline['abbrv'] = inline.abbr
inline['define'] = inline.abbr
inline['cvt'] = inline.convert

module.exports = inline
