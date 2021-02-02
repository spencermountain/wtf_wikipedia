const parse = require('../parse/toJSON')
const strip = require('../parse/toJSON/_strip')

let templates = {
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

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, list) => {
    let order = ['id', 'name', 'type']
    let obj = parse(tmpl, order)
    obj.type = 'gnis'
    obj.template = 'citation'
    list.push(obj)
    return ''
  },

  'spoken wikipedia': (tmpl, list) => {
    let order = ['file', 'date']
    let obj = parse(tmpl, order)
    obj.template = 'audio'
    list.push(obj)
    return ''
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
    return `c. ${obj.year}`
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
    year = parseInt(year / 10, 10) * 10 // round to decade
    return `${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    year = parseInt(year / 100, 10) + 1
    return `${year}`
  },

  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, list) => {
    let obj = parse(tmpl, ['formula'])
    list.push(obj)
    return '\n\n' + (obj.formula || '') + '\n\n'
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl) => {
    let order = ['after', 'before']
    let obj = parse(tmpl, order)
    return `${obj.before || ''}√${obj.after || ''}`
  },

  isbn: (tmpl, list) => {
    let order = ['id', 'id2', 'id3']
    let obj = parse(tmpl, order)
    list.push(obj)
    return 'ISBN: ' + (obj.id || '')
  },

  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, list) => {
    let obj = parse(tmpl, ['title', 'author'])
    list.push(obj)
    return `${obj.title} by ${obj.author || ''}`
  },

  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  'bbl to t': (tmpl, list) => {
    let obj = parse(tmpl, ['barrels'])
    list.push(obj)
    if (obj.barrels === '0') {
      return obj.barrels + ' barrel'
    }
    return obj.barrels + ' barrels'
  },

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, list) => {
    let obj = parse(tmpl, ['number', 'text'])
    list.push(obj)
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`
  },

  'medical cases chart/row': (tmpl) => {
    // Deprecated template; we keep it.
    return tmpl
  },

  //yellow card
  yel: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `yellow: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  subon: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `sub on: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  suboff: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `sub off: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  pengoal: (tmpl, list) => {
    list.push({
      template: 'pengoal',
    })
    return '✅'
  },

  penmiss: (tmpl, list) => {
    list.push({
      template: 'penmiss',
    })
    return '❌'
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

  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    obj.list = obj.list || []
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`)
    return lines.join('\n\n')
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

  // https://en.wikipedia.org/wiki/Template:Title_year
  'title year': (tmpl, _list, _alias, doc) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || doc.title()
    if (title) {
      let m = title.match(/\b[0-9]{4}\b/) //parse the year out of the title's name
      if (m) {
        return m[0]
      }
    }
    return obj.nomatch || '' //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_century
  'title century': (tmpl, _list, _alias, doc) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || doc.title()
    if (title) {
      let m = title.match(/\b([0-9]+)(st|nd|rd|th)\b/) //parse the century out of the title's name
      if (m) {
        return m[1] || ''
      }
    }
    return obj.nomatch || '' //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_decade
  'title decade': (tmpl, _list, _alias, doc) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || doc.title()
    if (title) {
      let m = title.match(/\b([0-9]+)s\b/) //parse the decade out of the title's name
      if (m) {
        return m[1] || ''
      }
    }
    return obj.nomatch || '' //use default response
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

  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, list) => {
    let obj = parse(tmpl, ['english', 'kanji', 'romaji', 'extra'])
    list.push(obj)
    let str = obj.english || obj.romaji || ''
    if (obj.kanji) {
      str += ` (${obj.kanji})`
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, list) => {
    let data = parse(tmpl, ['spouse', 'from', 'to', 'end'])
    list.push(data)
    let str = data.spouse || ''
    if (data.from) {
      if (data.to) {
        str += ` (m. ${data.from}-${data.to})`
      } else {
        str += ` (m. ${data.from})`
      }
    }
    return str
  },

  // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
  tl: (tmpl) => {
    let order = ['first', 'second']
    let obj = parse(tmpl, order)
    return obj.second || obj.first
  },

  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, list) => {
    let obj = parse(tmpl, ['cards'])
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || [],
    }
    list.push(result)
    let mins = result.minutes.map((m) => m + "'").join(', ')
    return 'sent off: ' + mins
  },

  //https://en.wikipedia.org/wiki/Template:Sfn
  sfn: (tmpl, list, alias) => {
    let order = ['author', 'year', 'location']
    let obj = parse(tmpl, order)
    if (alias) {
      obj.name = obj.template
      obj.teplate = alias
    }
    list.push(obj)
    return ''
  },
}
module.exports = templates
