import parse from '../../parse/toJSON/index.js'
import strip from '../../parse/toJSON/_strip.js'
import { titlecase, percentage } from '../_lib.js'

export default {
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
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: (tmpl) => {
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

  reign: (tmpl) => {
    let order = ['start', 'end']
    let obj = parse(tmpl, order)
    return `(r. ${obj.start} – ${obj.end})`
  },

  circa: (tmpl) => {
    let obj = parse(tmpl, ['year'])
    return `c. ${obj.year}`
  },

  // https://en.wikipedia.org/wiki/Template:Decade_link
  'decade link': (tmpl) => {
    let obj = parse(tmpl, ['year'])
    return `${obj.year}|${obj.year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Decade
  decade: (tmpl) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    year = Math.floor(year / 10) * 10 // round to decade
    return `${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl) => {
    let obj = parse(tmpl, ['year'])
    let year = parseInt(obj.year, 10)
    year = Math.floor(year / 100) + 1
    return `${year}`
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl) => {
    let order = ['after', 'before']
    let obj = parse(tmpl, order)
    return `${obj.before || ''}√${obj.after || ''}`
  },

  'medical cases chart/row': (tmpl) => {
    // Deprecated template; we keep it.
    return tmpl
  },

  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl) => {
    let order = ['date', 'year']
    let obj = parse(tmpl, order)
    return obj.year ? obj.date + ' ' + obj.year : obj.date
  },

  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl) => {
    let obj = parse(tmpl, ['text'])
    let attrs = ''
    if (obj.list) {
      attrs = '|' + obj.list.join('|')
    }
    return '{{' + (obj.text || '') + attrs + '}}'
  },

  hlist: (tmpl) => {
    let obj = parse(tmpl)
    obj.list = obj.list || []
    return obj.list.join(' · ')
  },

  pagelist: (tmpl) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: (tmpl) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': (tmpl) => {
    let arr = parse(tmpl).list || []
    return arr.join('\n\n')
  },

  'comma separated entries': (tmpl) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': (tmpl) => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str, i) => `${i + 1}. ${str}`)
    return arr.join('\n\n')
  },

  'bulleted list': (tmpl) => {
    let arr = parse(tmpl).list || []
    arr = arr.filter((f) => f)
    arr = arr.map((str) => '• ' + str)
    return arr.join('\n\n')
  },

  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl)
    let arr = tmpl.split('|').slice(1) //remove the title
    arr = arr.join('|').split(/\n ?\* ?/) //split on newline
    arr = arr.filter((s) => s)
    return arr.join('\n\n')
  },

  //https://en.wikipedia.org/wiki/Template:Term
  term: (tmpl) => {
    let obj = parse(tmpl, ['term'])
    return `${obj.term}:`
  },

  linum: (tmpl) => {
    let obj = parse(tmpl, ['num', 'text'])
    return `${obj.num}. ${obj.text}`
  },

  'block indent': (tmpl) => {
    let obj = parse(tmpl)
    if (obj['1']) {
      return '\n' + obj['1'] + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`
  },

  //Foo-class
  lbc: (tmpl) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`
  },

  lbb: (tmpl) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}]]`
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['date', 'format'])
    return obj.date
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toLowerCase()
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toUpperCase()
  },

  lcfirst: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return ''
    }
    return text[0].toLowerCase() + text.substr(1)
  },

  ucfirst: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return ''
    }
    return text[0].toUpperCase() + text.substr(1)
  },

  padleft: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padStart(obj.num, obj.str || '0')
  },

  padright: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padEnd(obj.num, obj.str || '0')
  },

  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl) => {
    let obj = parse(tmpl, ['abbr', 'page'])
    if (obj.page) {
      return `[[${obj.page}|${obj.abbr}]]`
    }
    return `[[${obj.abbr}]]`
  },

  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl) => {
    let obj = parse(tmpl, ['author'])
    let str = 'Own work'
    if (obj.author) {
      str += ' by ' + obj.author
    }
    return str
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['number'])
    let str = obj.number || ''
    str = str.replace(/,/g, '')
    let num = Number(str)
    return num.toLocaleString() || ''
  },

  //https://en.wikipedia.org/wiki/Template:Frac
  frac: (tmpl) => {
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

  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl) => {
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

  // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
  tl: (tmpl) => {
    let order = ['first', 'second']
    let obj = parse(tmpl, order)
    return obj.second || obj.first
  },

  //this one's a little different
  won: (tmpl) => {
    let data = parse(tmpl, ['text'])
    return data.place || data.text || titlecase(data.template)
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

  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl) => {
    let obj = parse(tmpl, ['numerator', 'denominator', 'decimals'])
    let num = percentage(obj)
    if (num === null) {
      return ''
    }
    return num + '%'
  },

  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl) => {
    let obj = parse(tmpl, ['done', 'total', 'digits'])
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits,
    })
    if (num === null) {
      return ''
    }
    return `${obj.done} (${num}%) done`
  },
}
