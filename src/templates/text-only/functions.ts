import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import strip from '../../parse/templates/parse/toJSON/_strip.ts'
import roundNumber from './_lib.ts'
import { titlecase, percentage, toOrdinal } from '../_lib.ts'
export default {
  transliteration: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['1', '2', '3'])
    // With a scheme in parameter 2, the text moves to parameter 3.
    return obj['3'] ?? obj['2'] ?? ''
  },

  //https://en.wikipedia.org/wiki/Template:Ra
  ra: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: (tmpl, _list, parse = defaultParse) => {
    //this template should do the conversion
    let obj = parse(tmpl, ['degrees'])
    return (obj.degrees || '') + '°'
  },

  hms2deg: (tmpl, _list, parse = defaultParse) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  decdeg: (tmpl, _list, parse = defaultParse) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd'])
    return (obj.deg || obj.degrees) + '°'
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['first', 'last', 'target', 'sort'])
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
  'first word': (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    let str = obj.text || ''
    if (obj.sep) {
      return str.split(obj.sep)[0]
    }
    return str.split(' ')[0]
  },

  trunc: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['str', 'len'])
    return (obj.str || '').substr(0, obj.len)
  },

  'str mid': (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['str', 'start', 'end']) || {}
    let start = parseInt(obj.start, 10) - 1
    let end = parseInt(obj.end, 10)
    return (obj.str || '').substr(start, end)
  },

  reign: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['start', 'end'])
    return `(r. ${obj.start} – ${obj.end})`
  },

  // https://en.wikipedia.org/wiki/Template:Decade_link
  'decade link': (tmpl, _list, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return `${year}|${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Decade
  decade: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    year = Math.floor(year / 10) * 10 // round to decade
    return `${year}s`
  },

  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['year'])
    let year = parseInt(obj.year, 10)
    year = Math.floor(year / 100) + 1
    return `${year}`
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['after', 'before'])
    return `${obj.before || ''}√${obj.after || ''}`
  },

  'medical cases chart/row': (tmpl) => {
    // Deprecated template; we keep it.
    return tmpl
  },

  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['date', 'year'])
    return obj.year ? obj.date + ' ' + obj.year : obj.date
  },

  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    let attrs = ''
    if (obj.list) {
      attrs = '|' + obj.list.join('|')
    }
    return '{{' + (obj.text || '') + attrs + '}}'
  },

  hlist: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl)
    obj.list ||= []
    return obj.list.join(' · ')
  },

  pagelist: (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  // not perfect - https://en.m.wikipedia.org/wiki/Template:Interlinear
  interlinear: (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return arr.join('\n\n')
  },

  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return arr.join('\n\n')
  },

  'comma separated entries': (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },

  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str, i) => `${i + 1}. ${str}`)
    return arr.join('\n\n')
  },

  'bulleted list': (tmpl, _list, parse = defaultParse) => {
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
  term: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['term'])
    return `${obj.term}:`
  },

  linum: (tmpl, _list, parse = defaultParse) => {
    let { num, text } = parse(tmpl, ['num', 'text'])
    return `${num}. ${text}`
  },

  'block indent': (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl)
    if (obj['1']) {
      return '\n' + obj['1'] + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`
  },

  //Foo-class
  lbc: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`
  },

  lbb: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return `[[${obj.text}-class lifeboat|${obj.text}]]`
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['date', 'format'])
    return obj.date
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toLowerCase()
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return (obj.text || '').toUpperCase()
  },

  lcfirst: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return ''
    }
    return text[0].toLowerCase() + text.substr(1)
  },

  ucfirst: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return ''
    }
    return text[0].toUpperCase() + text.substr(1)
  },

  padleft: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padStart(obj.num, obj.str || '0')
  },

  padright: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return text.padEnd(obj.num, obj.str || '0')
  },

  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['abbr', 'page'])
    if (obj.page) {
      return `[[${obj.page}|${obj.abbr}]]`
    }
    return `[[${obj.abbr}]]`
  },

  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['author'])
    let str = 'Own work'
    if (obj.author) {
      str += ' by ' + obj.author
    }
    return str
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['number'])
    let str = obj.number || ''
    str = str.replace(/,/g, '')
    let num = Number(str)
    return num.toLocaleString() || ''
  },

  //https://en.wikipedia.org/wiki/Template:Frac
  fraction: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['a', 'b', 'c'])
    if (obj.c) {
      return `${obj.a} ${obj.b}/${obj.c}`
    }
    if (obj.b) {
      return `${obj.a}/${obj.b}`
    }
    return `1/${obj.b}`
  },

  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['num', 'two', 'three', 'four'])
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
  tl: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['first', 'second'])
    return obj.second || obj.first
  },

  //this one's a little different
  won: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return data.place || data.text || titlecase(data.template)
  },

  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl, _list, parse = defaultParse) => {
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
  plural: (tmpl, _list, parse = defaultParse) => {
    tmpl = tmpl.replace(/plural:/, 'plural|')
    let obj = parse(tmpl, ['num', 'word'])
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
  dec: (tmpl, _list, parse = defaultParse) => {
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
  val: (tmpl, _list, parse = defaultParse) => {
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
  percentage: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl, ['numerator', 'denominator', 'decimals'])
    let num = Number(obj.numerator) / Number(obj.denominator)
    num *= 100
    if (isNaN(num)) {
      return ''
    }
    let dec = Number(obj.decimals) || 0
    return `${num.toFixed(dec)}%`
  },
  // this one is re-used by i18n
  small: (tmpl, _list, parse = defaultParse) => {
    let obj = parse(tmpl)
    if (obj.list && obj.list[0]) {
      return obj.list[0]
    }
    return ''
  },

  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl, _list, parse = defaultParse) => {
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

  loop: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['times', 'text'])
    let n = Number(data.times) || 0
    let out = ''
    for (let i = 0; i < n; i += 1) {
      out += data.text || ''
    }
    return out
  },
  'str len': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return String((data.text || '').trim().length)
  },
  digits: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return (data.text || '').replace(/[^0-9]/g, '')
  },
  resize: (tmpl, _list, parse = defaultParse) => {
    let { n, text } = parse(tmpl, ['n', 'text'])
    if (!text) {
      return n || ''
    }
    return text || ''
  },
  'last word': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    let arr = (data.text || '').split(/ /g)
    return arr.at(-1) || ''
  },
  replace: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text', 'from', 'to'])
    if (!data.from || !data.to) {
      return data.text || ''
    }
    return (data.text || '').replace(data.from, data.to)
  },
  'title case': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    let txt = data.text || ''
    return txt
      .split(/ /)
      .map((w, i) => {
        if ((i > 0 && w === 'the') || w === 'of') {
          return w
        }
        return titlecase(w)
      })
      .join(' ')
  },
  'no spam': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['account', 'domain'])
    return `${data.account || ''}@${data.domain}`
  },
  'baseball year': (tmpl, _list, parse = defaultParse) => {
    let year = parse(tmpl, ['year']).year || ''
    return `[[${year} in baseball|${year}]]`
  },
  'mlb year': (tmpl, _list, parse = defaultParse) => {
    let year = parse(tmpl, ['year']).year || ''
    return `[[${year} Major League Baseball season|${year}]]`
  },
  'nlds year': (tmpl, _list, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return `[[${year || ''} National League Division Series|${year}]]`
  },
  'alds year': (tmpl, _list, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return `[[${year || ''} American League Division Series|${year}]]`
  },
  'nfl year': (tmpl, _list, parse = defaultParse) => {
    let { year, other } = parse(tmpl, ['year', 'other'])
    if (other && year) {
      return `[[${year} NFL season|${year}]]–[[${other} NFL season|${other}]]`
    }
    return `[[${year || ''} NFL season|${year}]]`
  },
  'nfl playoff year': (tmpl, _list, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    year = Number(year)
    let after = year + 1
    return `[[${year}–${after} NFL playoffs|${year}]]`
  },
  'nba year': (tmpl, _list, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    year = Number(year)
    let after = year + 1
    return `[[${year}–${after} NBA season|${year}–${after}]]`
  },
  'mhl year': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['year'])
    let year = Number(data.year)
    let after = year + 1
    return `[[${year}–${after} NHL season|${year}–${after}]]`
  },
  // some math
  min: (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    let min = Number(arr[0]) || 0
    arr.forEach((str) => {
      let n = Number(str)
      if (!isNaN(n) && n < min) {
        min = n
      }
    })
    return String(min)
  },
  max: (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    let max = Number(arr[0]) || 0
    arr.forEach((str) => {
      let n = Number(str)
      if (!isNaN(n) && n > max) {
        max = n
      }
    })
    return String(max)
  },
  // US-politics
  uspolabbr: (tmpl, _list, parse = defaultParse) => {
    let { party, state, house } = parse(tmpl, ['party', 'state', 'house', 'link'])
    if (!party || !state) {
      return ''
    }
    let out = `${party}‑${state}`
    if (house) {
      out += ` ${toOrdinal(house)}`
    }
    return out
  },
  // https://en.wikipedia.org/wiki/Template:Ushr
  ushr: (tmpl, _list, parse = defaultParse) => {
    let { state, num, type } = parse(tmpl, ['state', 'num', 'type'])
    let link = ''
    if (num === 'AL') {
      link = `${state}'s at-large congressional district`
    } else {
      num = toOrdinal(Number(num))
      return `${state}'s ${num} congressional district`
    }
    if (type) {
      type = type.toLowerCase()
      num = num === 'AL' ? 'At-large' : num
      // there are many of these
      if (type === 'e') {
        return `[[${link}|${num}]]`
      }
      if (type === 'u') {
        return `[[${link}|${state}]]`
      }
      if (type === 'b' || type === 'x') {
        return `[[${link}|${state} ${num}]]`
      }
    }
    return `[[${link}]]`
  },

  // transit station links
  metro: (tmpl, _list, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return `[[${name} station (${dab})|${name}]]`
    }
    return `[[${name} station|${name}]]`
  },
  station: (tmpl, _list, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'x', 'dab'])
    if (dab) {
      return `[[${name} station (${dab})|${name}]]`
    }
    return `[[${name} station|${name}]]`
  },
  bssrws: (tmpl, _list, parse = defaultParse) => {
    let { one, two } = parse(tmpl, ['one', 'two'])
    let name = one
    if (two) {
      name += ' ' + two
    }
    return `[[${name} railway station|${name}]]`
  },
  stnlnk: (tmpl, _list, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return `[[${name} railway station (${dab})|${name}]]`
    }
    return `[[${name} railway station|${name}]]`
  },
  // https://en.wikipedia.org/wiki/Template:Station_link
  'station link': (tmpl, _list, parse = defaultParse) => {
    let { station, system } = parse(tmpl, ['system', 'station']) //incomplete
    return station || system
  },
  'line link': (tmpl, _list, parse = defaultParse) => {
    let { station, system } = parse(tmpl, ['system', 'station']) //incomplete
    return station || system
  },
  subway: (tmpl, _list, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return `[[${name} subway station|${name}]]`
  },
  'lrt station': (tmpl, _list, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return `[[${name} LRT station|${name}]]`
  },
  'mrt station': (tmpl, _list, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return `[[${name} MRT station|${name}]]`
  },
  rht: (tmpl, _list, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return `[[${name} railway halt|${name}]]`
  },
  ferry: (tmpl, _list, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return `[[${name} ferry wharf|${name}]]`
  },
  tram: (tmpl, _list, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return `[[${name} tram stop (${dab})|${name}]]`
    }
    return `[[${name} tram stop|${name}]]`
  },
  tstop: (tmpl, _list, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return `[[${name} ${dab} stop|${name}]]`
    }
    return `[[${name} stop|${name}]]`
  },
  // boats
  ship: (tmpl, _list, parse = defaultParse) => {
    let { prefix, name, id } = parse(tmpl, ['prefix', 'name', 'id'])
    prefix ||= ''
    return id ? `[[${prefix.toUpperCase()} ${name}]]` : `[[${prefix.toUpperCase()} ${name}]]`
  },
  sclass: (tmpl, _list, parse = defaultParse) => {
    let { cl, type } = parse(tmpl, ['cl', 'type', 'fmt'])
    return `[[${cl}-class ${type} |''${cl}''-class]] [[${type}]]`
  },
  'center block': (tmpl, _list, parse = defaultParse) => {
    let { text } = parse(tmpl, ['text'])
    return text || ''
  },
  align: (tmpl, _list, parse = defaultParse) => {
    let { text } = parse(tmpl, ['dir', 'text'])
    return text || ''
  },
  font: (tmpl, _list, parse = defaultParse) => {
    let { text } = parse(tmpl, ['text'])
    return text || ''
  },
  float: (tmpl, _list, parse = defaultParse) => {
    let { text, dir } = parse(tmpl, ['dir', 'text'])
    if (!text) {
      return dir || ''
    }
    return text
  },
  lower: (tmpl, _list, parse = defaultParse) => {
    let { text, n } = parse(tmpl, ['n', 'text'])
    if (!text) {
      return n || ''
    }
    return text
  },
  splitspan: (tmpl, _list, parse = defaultParse) => {
    let list = parse(tmpl).list || []
    return (list[0] || '') + '\n' + (list[1] || '')
  },
  bracket: (tmpl, _list, parse = defaultParse) => {
    let { text } = parse(tmpl, ['text'])
    if (text) {
      return `[${text}]`
    }
    return '['
  },

  // https://en.wikipedia.org/wiki/Template:In_title
  'in title': (tmpl, _list, parse = defaultParse) => {
    let { title, text } = parse(tmpl, ['title', 'text'])
    if (text) {
      return text
    }
    if (title) {
      return `All pages with titles containing ${title}` //[[Special: ..]]
    }
    return ''
  },
  'look from': (tmpl, _list, parse = defaultParse) => {
    let { title, text } = parse(tmpl, ['title', 'text'])
    if (text) {
      return text
    }
    if (title) {
      return `All pages with titles beginning with ${title}` //[[Special: ..]]
    }
    return ''
  },

  'literal translation': (tmpl, _list, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str) => `'${str}'`)
    return 'lit. ' + arr.join(' or ')
  },
  overset: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['over', 'base'])
    return [data.over || '', data.base || ''].join(' ')
  },
  underset: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['under', 'base'])
    return [data.base || '', data.under || ''].join(' ')
  },
  ceil: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return `⌈${data.txt}⌉`
  },
  floor: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return `⌊${data.txt}⌋`
  },
  'vol.': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['n'])
    return `vol. ${data.n}`
  },
  rp: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['page'])
    if (data.pages) {
      return `pp${data.pages}`
    }
    return `p. ${data.page || ''}`
  },
  gaps: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl)
    return (data.list || []).join('  ')
  },
  bra: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a'])
    return `⟨${data.a || ''}|`
  },
  ket: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a'])
    return `${data.a || ''}⟩`
  },
  'angle bracket': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return `⟨${data.txt || ''}⟩`
  },
  'bra-ket': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return `⟨${data.a || ''}|${data.b || ''}⟩`
  },
  braket: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['sym', 'a', 'b'])
    if (data.sym === 'bra') {
      return `⟨${data.a}|`
    } else if (data.sym === 'ket') {
      return `⟨|${data.a || ''}⟩`
    } else {
      return `⟨${data.a || ''}|${data.b || ''}⟩`
    }
  },
  pars: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text', 's'])
    return `(${data.text || ''})`
  },
  circumfix: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return `⟩${data.text || ''}⟨`
  },
  fluc: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val', 'type'])
    let n = Number(data.val)
    if (data['custom label']) {
      return data['custom label']
    }
    if (n > 0) {
      return ` +${n}` //▲
    } else if (n < 0) {
      return ` ${n}` //▼
    } else if (n === 0) {
      return ` no change `
    }
    return data.val || ''
  },

  'p.': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    if (data.b) {
      if (parseInt(data.b, 10)) {
        return `pp. ${data.a}–${data.b}` //page-range
      } else {
        return `pp. ${data.a}${data.b}`
      }
    }
    return `p. ${data.a || ''}`
  },
  subsup: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['symbol', 'subscript', 'superscript'])
    return `${data.symbol || ''} ${data.subscript || ''} ${data.superscript || ''}`
  },
  su: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['p', 'b'])
    return `${data.p || ''} ${data.b || ''}`
  },
  precision: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['num'])
    let num = data.num || ''
    if (!num.includes('.') && num !== '0') {
      let end = num.length
      while (end > 0 && num[end - 1] === '0') {
        end -= 1
      }
      return (num.length - end) * -1
    }
    let dec = num.split(/\./)[1] || ''
    return dec.length
  },
  intmath: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['sign', 'subscript', 'superscript'])
    const signs = {
      int: '∫',
      iint: '∬',
      iiint: '∭',
      oint: '∮',
      varointclockwise: '∲',
      ointctrclockwise: '∳',
      oiint: '∯',
      oiiint: '∰',
    }
    return `${signs[data.sign] || ''} ${data.superscript || ''} ${data.subscript || ''} `
  },
  ldelim: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b', 'sub', 'sup'])
    let after = `${data.sub || ''}${data.sup || ''}`
    if (data.a === 'square') {
      return `[${data.b || ''}]${after}`
    } else if (data.a === 'round') {
      return `(${data.b || ''})${after}`
    } else if (data.a === 'vert') {
      return `|${data.b || ''}|${after}`
    } else if (data.a === 'doublevert') {
      return `||${data.b || ''}||${after}`
    }
    return `${data.b || ''} ${after}`
  },
  multiply: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return Number(data.a) * Number(data.b)
  },
  sum: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return Number(data.a) + Number(data.b)
  },
  round: (tmpl, _list, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return roundNumber(data.val, data.decimals, Math.round)
  },
  rounddown: (tmpl, _list, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return roundNumber(data.val, data.decimals, Math.floor)
  },
  roundup: (tmpl, _list, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return roundNumber(data.val, data.decimals, Math.ceil)
  },
  parity: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val', 'even', 'odd'])
    if (Number(data.val) % 2 === 0) {
      return data.even || 'even'
    }
    return data.odd || 'odd'
  },
  hexadecimal: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    let n = Number(data.val)
    if (!n) {
      return data.val
    }
    return n.toString(16).toUpperCase()
  },
  octal: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    let n = Number(data.val)
    if (!n) {
      return data.val
    }
    return n.toString(8).toUpperCase() + '₈'
  },
  decimal2base: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['n', 'radix'])
    let n = Number(data.n)
    let radix = Number(data.radix)
    if (!n || !radix) {
      return data.n
    }
    return n.toString(radix).toUpperCase()
  },
  hex2dec: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    return parseInt(data.val, 16) || data.val
  },
  ifnotempty: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['cond', 'a', 'b'])
    if (data.cond) {
      return data.a
    }
    return data.b
  },
  both: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    if (data.a && data.b) {
      return '1'
    }
    return ''
  },
  ifnumber: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['n', 'yes', 'no'])
    if (!isNaN(Number(data.n))) {
      return data.yes || '1'
    }
    return data.no || ''
  },
  'order of magnitude': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    const num = Math.abs(Number(data.val))
    if (!Number.isFinite(num) || num === 0) {
      return '0'
    }
    return String(Math.floor(Math.log10(num)))
  },
  'percent and number': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['number', 'total', 'decimals'])
    let n = Number(data.number) / Number(data.total)
    n *= 100
    let dec = Number(data.decimals) || 0
    return `${n.toFixed(dec)}% (${Number(data.number).toLocaleString()})`
  },
  music: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['glyph'])
    // these have unicode working character subs
    let glyphs = {
      flat: '♭',
      b: '♭',
      sharp: '♯',
      '#': '♯',
      natural: '♮',
      n: '♮',
      doubleflat: '𝄫',
      bb: '𝄫',
      '##': '𝄪',
      doublesharp: '𝄪',
      quarternote: '♩',
      quarter: '♩',
      treble: '𝄞',
      trebleclef: '𝄞',
      bass: '𝄢',
      bassclef: '𝄢',
      altoclef: '𝄡',
      alto: '𝄡',
      tenor: '𝄡',
      tenorclef: '𝄡',
    }
    if (Object.hasOwn(glyphs, data.glyph)) {
      return glyphs[data.glyph]
    }
    return ''
  },
  simplenuclide: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['name', 'mass'])
    return `[[${data.name}|${data.mass || ''}${data.name}]]`
  },
  'font color': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['fg', 'bg', 'text'])
    if (data.bg && data.text) {
      return data.text
    }
    return data.bg
  },
  'colored link': (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['color', 'title', 'text'])
    return `[[${data.title}|${data.text || data.title}]]`
  },
  nftu: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['age', 'team'])
    return `${data.team} U${data.age}`
  },
  tls: (tmpl, _list, parse = defaultParse) => {
    let data = parse(tmpl, ['name', 'one', 'two'])
    let out = `subst:${data.name}`
    if (data.one) {
      out += '|' + data.one
    }
    if (data.two) {
      out += '|' + data.two
    }
    return `{{${out}}}`
  },
}
