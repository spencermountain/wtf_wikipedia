import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import parseArguments from '../../parse/templates/parse/toJSON/index.ts'
import strip from '../../parse/templates/parse/toJSON/_strip.ts'
import roundNumber from './_lib.ts'
import { titlecase, percentage, toOrdinal } from '../_lib.ts'
export default {
  transliteration: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['1', '2', '3'])
    // With a scheme in parameter 2, the text moves to parameter 3.
    return { data: null, replacement: obj['3'] ?? obj['2'] ?? '' }
  },

  //https://en.wikipedia.org/wiki/Template:Ra
  ra: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return { data: null, replacement: [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':') }
  },

  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: (tmpl, parse = defaultParse) => {
    //this template should do the conversion
    let obj = parse(tmpl, ['degrees'])
    return { data: null, replacement: (obj.degrees || '') + '°' }
  },

  hms2deg: (tmpl, parse = defaultParse) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return { data: null, replacement: [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':') }
  },

  decdeg: (tmpl, parse = defaultParse) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd'])
    return { data: null, replacement: (obj.deg || obj.degrees) + '°' }
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['first', 'last', 'target', 'sort'])
    let name = `${obj.first || ''} ${obj.last || ''}`
    name = name.trim()
    if (obj.nolink) {
      return { data: null, replacement: obj.target || name }
    }
    if (obj.dab) {
      name += ` (${obj.dab})`
      if (obj.target) {
        obj.target += ` (${obj.dab})`
      }
    }
    if (obj.target) {
      return { data: null, replacement: `[[${obj.target}|${name}]]` }
    }
    return { data: null, replacement: `[[${name}]]` }
  },

  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    let str = obj.text || ''
    if (obj.sep) {
      return { data: null, replacement: str.split(obj.sep)[0] }
    }
    return { data: null, replacement: str.split(' ')[0] }
  },

  trunc: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['str', 'len'])
    return { data: null, replacement: (obj.str || '').substr(0, obj.len) }
  },

  'str mid': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['str', 'start', 'end']) || {}
    let start = parseInt(obj.start, 10) - 1
    let end = parseInt(obj.end, 10)
    return { data: null, replacement: (obj.str || '').substr(start, end) }
  },

  reign: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['start', 'end'])
    return { data: null, replacement: `(r. ${obj.start} – ${obj.end})` }
  },

  // https://en.wikipedia.org/wiki/Template:Decade_link
  'decade link': (tmpl, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return { data: null, replacement: `${year}|${year}s` }
  },

  // https://en.wikipedia.org/wiki/Template:Decade
  decade: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    year = Math.floor(year / 10) * 10 // round to decade
    return { data: null, replacement: `${year}s` }
  },

  // https://en.wikipedia.org/wiki/Template:Century
  century: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year'])
    let year = parseInt(obj.year, 10)
    year = Math.floor(year / 100) + 1
    return { data: null, replacement: `${year}` }
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  radic: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['after', 'before'])
    return { data: null, replacement: `${obj.before || ''}√${obj.after || ''}` }
  },

  'medical cases chart/row': (tmpl) => {
    // Deprecated template; we keep it.
    return { data: null, replacement: tmpl }
  },

  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['date', 'year'])
    return { data: null, replacement: obj.year ? obj.date + ' ' + obj.year : obj.date }
  },

  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    let attrs = ''
    if (obj.list) {
      attrs = '|' + obj.list.join('|')
    }
    return { data: null, replacement: '{{' + (obj.text || '') + attrs + '}}' }
  },

  hlist: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    obj.list ||= []
    return { data: null, replacement: obj.list.join(' · ') }
  },

  pagelist: (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return { data: null, replacement: arr.join(', ') }
  },

  // not perfect - https://en.m.wikipedia.org/wiki/Template:Interlinear
  interlinear: (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return { data: null, replacement: arr.join('\n\n') }
  },

  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return { data: null, replacement: arr.join(', ') }
  },

  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return { data: null, replacement: arr.join('\n\n') }
  },

  'comma separated entries': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    return { data: null, replacement: arr.join(', ') }
  },

  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str, i) => `${i + 1}. ${str}`)
    return { data: null, replacement: arr.join('\n\n') }
  },

  'bulleted list': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    arr = arr.filter((f) => f)
    arr = arr.map((str) => '• ' + str)
    return { data: null, replacement: arr.join('\n\n') }
  },

  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl)
    let arr = tmpl.split('|').slice(1) //remove the title
    arr = arr.join('|').split(/\n ?\* ?/) //split on newline
    arr = arr.filter((s) => s)
    return { data: null, replacement: arr.join('\n\n') }
  },

  //https://en.wikipedia.org/wiki/Template:Term
  term: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['term'])
    return { data: null, replacement: `${obj.term}:` }
  },

  linum: (tmpl, parse = defaultParse) => {
    let { num, text } = parse(tmpl, ['num', 'text'])
    return { data: null, replacement: `${num}. ${text}` }
  },

  'block indent': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    if (obj['1']) {
      return { data: null, replacement: '\n' + obj['1'] + '\n' }
    }
    return { data: null, replacement: '' }
  },

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return { data: null, replacement: `[[${obj.text} Lifeboat Station|${obj.text}]]` }
  },

  //Foo-class
  lbc: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return { data: null, replacement: `[[${obj.text}-class lifeboat|${obj.text}-class]]` }
  },

  lbb: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text'])
    return { data: null, replacement: `[[${obj.text}-class lifeboat|${obj.text}]]` }
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['date', 'format'])
    return { data: null, replacement: obj.date }
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return { data: null, replacement: (obj.text || '').toLowerCase() }
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text'])
    return { data: null, replacement: (obj.text || '').toUpperCase() }
  },

  lcfirst: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: text[0].toLowerCase() + text.substr(1) }
  },

  ucfirst: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let text = parse(tmpl, ['text']).text
    if (!text) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: text[0].toUpperCase() + text.substr(1) }
  },

  padleft: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return { data: null, replacement: text.padStart(obj.num, obj.str || '0') }
  },

  padright: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['text', 'num'])
    let text = obj.text || ''
    return { data: null, replacement: text.padEnd(obj.num, obj.str || '0') }
  },

  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['abbr', 'page'])
    if (obj.page) {
      return { data: null, replacement: `[[${obj.page}|${obj.abbr}]]` }
    }
    return { data: null, replacement: `[[${obj.abbr}]]` }
  },

  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['author'])
    let str = 'Own work'
    if (obj.author) {
      str += ' by ' + obj.author
    }
    return { data: null, replacement: str }
  },

  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl, parse = defaultParse) => {
    tmpl = tmpl.replace(/:/, '|')
    let obj = parse(tmpl, ['number'])
    let str = obj.number || ''
    str = str.replace(/,/g, '')
    let num = Number(str)
    return { data: null, replacement: num.toLocaleString() || '' }
  },

  //https://en.wikipedia.org/wiki/Template:Frac
  fraction: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['a', 'b', 'c'])
    if (obj.c) {
      return { data: null, replacement: `${obj.a} ${obj.b}/${obj.c}` }
    }
    if (obj.b) {
      return { data: null, replacement: `${obj.a}/${obj.b}` }
    }
    return { data: null, replacement: `1/${obj.b}` }
  },

  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['num', 'two', 'three', 'four'])
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return { data: null, replacement: `${obj.num} ${obj.two} ${obj.three} ${obj.four}` }
      }
      return { data: null, replacement: `${obj.num} ${obj.two} ${obj.three}` }
    }
    return { data: null, replacement: `${obj.num} ${obj.two}` }
  },

  // Large number of aliases - https://en.wikipedia.org/wiki/Template:Tl
  tl: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['first', 'second'])
    return { data: null, replacement: obj.second || obj.first }
  },

  //this one's a little different
  won: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: data.place || data.text || titlecase(data.template) }
  },

  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl, parse = defaultParse) => {
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
        return { data: null, replacement: obj.content || '' }
      }
      return { data: null, replacement: `<${obj.tag} ${obj.attribs || ''}>${obj.content || ''}</${obj.tag}>` }
    }
    return { data: null, replacement: '' }
  },

  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: (tmpl, parse = defaultParse) => {
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
    return { data: null, replacement: num + ' ' + word }
  },

  //https://en.wikipedia.org/wiki/Template:DEC
  dec: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['degrees', 'minutes', 'seconds'])
    let str = (obj.degrees || 0) + '°'
    if (obj.minutes) {
      str += obj.minutes + `′`
    }
    if (obj.seconds) {
      str += obj.seconds + '″'
    }
    return { data: null, replacement: str }
  },

  //https://en.wikipedia.org/wiki/Template:Val
  val: (tmpl, parse = defaultParse) => {
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
    return { data: null, replacement: str }
  },

  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['numerator', 'denominator', 'decimals'])
    let num = Number(obj.numerator) / Number(obj.denominator)
    num *= 100
    if (isNaN(num)) {
      return { data: null, replacement: '' }
    }
    let dec = Number(obj.decimals) || 0
    return { data: null, replacement: `${num.toFixed(dec)}%` }
  },
  // this one is re-used by i18n
  small: (tmpl, _parse = defaultParse, opts) => {
    let obj = parseArguments(tmpl, [], opts)
    if (obj.list && obj.list[0]) {
      return { data: null, replacement: obj.list[0].wiki }
    }
    return { data: null, replacement: '' }
  },

  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['done', 'total', 'digits'])
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits,
    })
    if (num === null) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: `${obj.done} (${num}%) done` }
  },

  loop: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['times', 'text'])
    let n = Number(data.times) || 0
    let out = ''
    for (let i = 0; i < n; i += 1) {
      out += data.text || ''
    }
    return { data: null, replacement: out }
  },
  'str len': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: String((data.text || '').trim().length) }
  },
  digits: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: (data.text || '').replace(/[^0-9]/g, '') }
  },
  resize: (tmpl, _parse = defaultParse, opts) => {
    const { n, text } = parseArguments(tmpl, ['n', 'text'], opts)
    return { data: null, replacement: text?.wiki || n?.wiki || '' }
  },
  'last word': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    let arr = (data.text || '').split(/ /g)
    return { data: null, replacement: arr.at(-1) || '' }
  },
  replace: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text', 'from', 'to'])
    if (!data.from || !data.to) {
      return { data: null, replacement: data.text || '' }
    }
    return { data: null, replacement: (data.text || '').replace(data.from, data.to) }
  },
  'title case': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    let txt = data.text || ''
    return { data: null, replacement: txt
      .split(/ /)
      .map((w, i) => {
        if ((i > 0 && w === 'the') || w === 'of') {
          return w
        }
        return titlecase(w)
      })
      .join(' ') }
  },
  'no spam': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['account', 'domain'])
    return { data: null, replacement: `${data.account || ''}@${data.domain}` }
  },
  'baseball year': (tmpl, parse = defaultParse) => {
    let year = parse(tmpl, ['year']).year || ''
    return { data: null, replacement: `[[${year} in baseball|${year}]]` }
  },
  'mlb year': (tmpl, parse = defaultParse) => {
    let year = parse(tmpl, ['year']).year || ''
    return { data: null, replacement: `[[${year} Major League Baseball season|${year}]]` }
  },
  'nlds year': (tmpl, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return { data: null, replacement: `[[${year || ''} National League Division Series|${year}]]` }
  },
  'alds year': (tmpl, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    return { data: null, replacement: `[[${year || ''} American League Division Series|${year}]]` }
  },
  'nfl year': (tmpl, parse = defaultParse) => {
    let { year, other } = parse(tmpl, ['year', 'other'])
    if (other && year) {
      return { data: null, replacement: `[[${year} NFL season|${year}]]–[[${other} NFL season|${other}]]` }
    }
    return { data: null, replacement: `[[${year || ''} NFL season|${year}]]` }
  },
  'nfl playoff year': (tmpl, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    year = Number(year)
    let after = year + 1
    return { data: null, replacement: `[[${year}–${after} NFL playoffs|${year}]]` }
  },
  'nba year': (tmpl, parse = defaultParse) => {
    let { year } = parse(tmpl, ['year'])
    year = Number(year)
    let after = year + 1
    return { data: null, replacement: `[[${year}–${after} NBA season|${year}–${after}]]` }
  },
  'mhl year': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['year'])
    let year = Number(data.year)
    let after = year + 1
    return { data: null, replacement: `[[${year}–${after} NHL season|${year}–${after}]]` }
  },
  // some math
  min: (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    let min = Number(arr[0]) || 0
    arr.forEach((str) => {
      let n = Number(str)
      if (!isNaN(n) && n < min) {
        min = n
      }
    })
    return { data: null, replacement: String(min) }
  },
  max: (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    let max = Number(arr[0]) || 0
    arr.forEach((str) => {
      let n = Number(str)
      if (!isNaN(n) && n > max) {
        max = n
      }
    })
    return { data: null, replacement: String(max) }
  },
  // US-politics
  uspolabbr: (tmpl, parse = defaultParse) => {
    let { party, state, house } = parse(tmpl, ['party', 'state', 'house', 'link'])
    if (!party || !state) {
      return { data: null, replacement: '' }
    }
    let out = `${party}‑${state}`
    if (house) {
      out += ` ${toOrdinal(house)}`
    }
    return { data: null, replacement: out }
  },
  // https://en.wikipedia.org/wiki/Template:Ushr
  ushr: (tmpl, parse = defaultParse) => {
    let { state, num, type } = parse(tmpl, ['state', 'num', 'type'])
    let link = ''
    if (num === 'AL') {
      link = `${state}'s at-large congressional district`
    } else {
      num = toOrdinal(Number(num))
      return { data: null, replacement: `${state}'s ${num} congressional district` }
    }
    if (type) {
      type = type.toLowerCase()
      num = num === 'AL' ? 'At-large' : num
      // there are many of these
      if (type === 'e') {
        return { data: null, replacement: `[[${link}|${num}]]` }
      }
      if (type === 'u') {
        return { data: null, replacement: `[[${link}|${state}]]` }
      }
      if (type === 'b' || type === 'x') {
        return { data: null, replacement: `[[${link}|${state} ${num}]]` }
      }
    }
    return { data: null, replacement: `[[${link}]]` }
  },

  // transit station links
  metro: (tmpl, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return { data: null, replacement: `[[${name} station (${dab})|${name}]]` }
    }
    return { data: null, replacement: `[[${name} station|${name}]]` }
  },
  station: (tmpl, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'x', 'dab'])
    if (dab) {
      return { data: null, replacement: `[[${name} station (${dab})|${name}]]` }
    }
    return { data: null, replacement: `[[${name} station|${name}]]` }
  },
  bssrws: (tmpl, parse = defaultParse) => {
    let { one, two } = parse(tmpl, ['one', 'two'])
    let name = one
    if (two) {
      name += ' ' + two
    }
    return { data: null, replacement: `[[${name} railway station|${name}]]` }
  },
  stnlnk: (tmpl, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return { data: null, replacement: `[[${name} railway station (${dab})|${name}]]` }
    }
    return { data: null, replacement: `[[${name} railway station|${name}]]` }
  },
  // https://en.wikipedia.org/wiki/Template:Station_link
  'station link': (tmpl, parse = defaultParse) => {
    let { station, system } = parse(tmpl, ['system', 'station']) //incomplete
    return { data: null, replacement: station || system }
  },
  'line link': (tmpl, parse = defaultParse) => {
    let { station, system } = parse(tmpl, ['system', 'station']) //incomplete
    return { data: null, replacement: station || system }
  },
  subway: (tmpl, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return { data: null, replacement: `[[${name} subway station|${name}]]` }
  },
  'lrt station': (tmpl, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return { data: null, replacement: `[[${name} LRT station|${name}]]` }
  },
  'mrt station': (tmpl, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return { data: null, replacement: `[[${name} MRT station|${name}]]` }
  },
  rht: (tmpl, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return { data: null, replacement: `[[${name} railway halt|${name}]]` }
  },
  ferry: (tmpl, parse = defaultParse) => {
    let { name } = parse(tmpl, ['name'])
    return { data: null, replacement: `[[${name} ferry wharf|${name}]]` }
  },
  tram: (tmpl, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return { data: null, replacement: `[[${name} tram stop (${dab})|${name}]]` }
    }
    return { data: null, replacement: `[[${name} tram stop|${name}]]` }
  },
  tstop: (tmpl, parse = defaultParse) => {
    let { name, dab } = parse(tmpl, ['name', 'dab'])
    if (dab) {
      return { data: null, replacement: `[[${name} ${dab} stop|${name}]]` }
    }
    return { data: null, replacement: `[[${name} stop|${name}]]` }
  },
  // boats
  ship: (tmpl, parse = defaultParse) => {
    let { prefix, name, id } = parse(tmpl, ['prefix', 'name', 'id'])
    prefix ||= ''
    return { data: null, replacement: id ? `[[${prefix.toUpperCase()} ${name}]]` : `[[${prefix.toUpperCase()} ${name}]]` }
  },
  sclass: (tmpl, parse = defaultParse) => {
    let { cl, type } = parse(tmpl, ['cl', 'type', 'fmt'])
    return { data: null, replacement: `[[${cl}-class ${type} |''${cl}''-class]] [[${type}]]` }
  },
  'center block': (tmpl, _parse = defaultParse, opts) => {
    const { text } = parseArguments(tmpl, ['text'], opts)
    return { data: null, replacement: text?.wiki || '' }
  },
  align: (tmpl, _parse = defaultParse, opts) => {
    const { text } = parseArguments(tmpl, ['dir', 'text'], opts)
    return { data: null, replacement: text?.wiki || '' }
  },
  font: (tmpl, _parse = defaultParse, opts) => {
    const { text } = parseArguments(tmpl, ['text'], opts)
    return { data: null, replacement: text?.wiki || '' }
  },
  float: (tmpl, _parse = defaultParse, opts) => {
    const { text, dir } = parseArguments(tmpl, ['dir', 'text'], opts)
    return { data: null, replacement: text?.wiki || dir?.wiki || '' }
  },
  lower: (tmpl, _parse = defaultParse, opts) => {
    const { text, n } = parseArguments(tmpl, ['n', 'text'], opts)
    return { data: null, replacement: text?.wiki || n?.wiki || '' }
  },
  splitspan: (tmpl, parse = defaultParse) => {
    let list = parse(tmpl).list || []
    return { data: null, replacement: (list[0] || '') + '\n' + (list[1] || '') }
  },
  bracket: (tmpl, parse = defaultParse) => {
    let { text } = parse(tmpl, ['text'])
    if (text) {
      return { data: null, replacement: `[${text}]` }
    }
    return { data: null, replacement: '[' }
  },

  // https://en.wikipedia.org/wiki/Template:In_title
  'in title': (tmpl, parse = defaultParse) => {
    let { title, text } = parse(tmpl, ['title', 'text'])
    if (text) {
      return { data: null, replacement: text }
    }
    if (title) {
      return { data: null, replacement: `All pages with titles containing ${title}` } //[[Special: ..]]
    }
    return { data: null, replacement: '' }
  },
  'look from': (tmpl, parse = defaultParse) => {
    let { title, text } = parse(tmpl, ['title', 'text'])
    if (text) {
      return { data: null, replacement: text }
    }
    if (title) {
      return { data: null, replacement: `All pages with titles beginning with ${title}` } //[[Special: ..]]
    }
    return { data: null, replacement: '' }
  },

  'literal translation': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str) => `'${str}'`)
    return { data: null, replacement: 'lit. ' + arr.join(' or ') }
  },
  overset: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['over', 'base'])
    return { data: null, replacement: [data.over || '', data.base || ''].join(' ') }
  },
  underset: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['under', 'base'])
    return { data: null, replacement: [data.base || '', data.under || ''].join(' ') }
  },
  ceil: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return { data: null, replacement: `⌈${data.txt}⌉` }
  },
  floor: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return { data: null, replacement: `⌊${data.txt}⌋` }
  },
  'vol.': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['n'])
    return { data: null, replacement: `vol. ${data.n}` }
  },
  rp: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['page'])
    if (data.pages) {
      return { data: null, replacement: `pp${data.pages}` }
    }
    return { data: null, replacement: `p. ${data.page || ''}` }
  },
  gaps: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl)
    return { data: null, replacement: (data.list || []).join('  ') }
  },
  bra: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a'])
    return { data: null, replacement: `⟨${data.a || ''}|` }
  },
  ket: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a'])
    return { data: null, replacement: `${data.a || ''}⟩` }
  },
  'angle bracket': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['txt'])
    return { data: null, replacement: `⟨${data.txt || ''}⟩` }
  },
  'bra-ket': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return { data: null, replacement: `⟨${data.a || ''}|${data.b || ''}⟩` }
  },
  braket: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['sym', 'a', 'b'])
    if (data.sym === 'bra') {
      return { data: null, replacement: `⟨${data.a}|` }
    } else if (data.sym === 'ket') {
      return { data: null, replacement: `⟨|${data.a || ''}⟩` }
    } else {
      return { data: null, replacement: `⟨${data.a || ''}|${data.b || ''}⟩` }
    }
  },
  pars: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text', 's'])
    return { data: null, replacement: `(${data.text || ''})` }
  },
  circumfix: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: `⟩${data.text || ''}⟨` }
  },
  fluc: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val', 'type'])
    let n = Number(data.val)
    if (data['custom label']) {
      return { data: null, replacement: data['custom label'] }
    }
    if (n > 0) {
      return { data: null, replacement: ` +${n}` } //▲
    } else if (n < 0) {
      return { data: null, replacement: ` ${n}` } //▼
    } else if (n === 0) {
      return { data: null, replacement: ` no change ` }
    }
    return { data: null, replacement: data.val || '' }
  },

  'p.': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    if (data.b) {
      if (parseInt(data.b, 10)) {
        return { data: null, replacement: `pp. ${data.a}–${data.b}` } //page-range
      } else {
        return { data: null, replacement: `pp. ${data.a}${data.b}` }
      }
    }
    return { data: null, replacement: `p. ${data.a || ''}` }
  },
  subsup: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['symbol', 'subscript', 'superscript'])
    return { data: null, replacement: `${data.symbol || ''} ${data.subscript || ''} ${data.superscript || ''}` }
  },
  su: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['p', 'b'])
    return { data: null, replacement: `${data.p || ''} ${data.b || ''}` }
  },
  precision: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['num'])
    let num = data.num || ''
    if (!num.includes('.') && num !== '0') {
      let end = num.length
      while (end > 0 && num[end - 1] === '0') {
        end -= 1
      }
      return { data: null, replacement: (num.length - end) * -1 }
    }
    let dec = num.split(/\./)[1] || ''
    return { data: null, replacement: dec.length }
  },
  intmath: (tmpl, parse = defaultParse) => {
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
    return { data: null, replacement: `${signs[data.sign] || ''} ${data.superscript || ''} ${data.subscript || ''} ` }
  },
  ldelim: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b', 'sub', 'sup'])
    let after = `${data.sub || ''}${data.sup || ''}`
    if (data.a === 'square') {
      return { data: null, replacement: `[${data.b || ''}]${after}` }
    } else if (data.a === 'round') {
      return { data: null, replacement: `(${data.b || ''})${after}` }
    } else if (data.a === 'vert') {
      return { data: null, replacement: `|${data.b || ''}|${after}` }
    } else if (data.a === 'doublevert') {
      return { data: null, replacement: `||${data.b || ''}||${after}` }
    }
    return { data: null, replacement: `${data.b || ''} ${after}` }
  },
  multiply: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return { data: null, replacement: Number(data.a) * Number(data.b) }
  },
  sum: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    return { data: null, replacement: Number(data.a) + Number(data.b) }
  },
  round: (tmpl, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.round) }
  },
  rounddown: (tmpl, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.floor) }
  },
  roundup: (tmpl, parse = defaultParse) => {
    const data = parse(tmpl, ['val', 'decimals'])
    return { data: null, replacement: roundNumber(data.val, data.decimals, Math.ceil) }
  },
  parity: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val', 'even', 'odd'])
    if (Number(data.val) % 2 === 0) {
      return { data: null, replacement: data.even || 'even' }
    }
    return { data: null, replacement: data.odd || 'odd' }
  },
  hexadecimal: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    let n = Number(data.val)
    if (!n) {
      return { data: null, replacement: data.val }
    }
    return { data: null, replacement: n.toString(16).toUpperCase() }
  },
  octal: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    let n = Number(data.val)
    if (!n) {
      return { data: null, replacement: data.val }
    }
    return { data: null, replacement: n.toString(8).toUpperCase() + '₈' }
  },
  decimal2base: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['n', 'radix'])
    let n = Number(data.n)
    let radix = Number(data.radix)
    if (!n || !radix) {
      return { data: null, replacement: data.n }
    }
    return { data: null, replacement: n.toString(radix).toUpperCase() }
  },
  hex2dec: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    return { data: null, replacement: parseInt(data.val, 16) || data.val }
  },
  ifnotempty: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['cond', 'a', 'b'])
    if (data.cond) {
      return { data: null, replacement: data.a }
    }
    return { data: null, replacement: data.b }
  },
  both: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['a', 'b'])
    if (data.a && data.b) {
      return { data: null, replacement: '1' }
    }
    return { data: null, replacement: '' }
  },
  ifnumber: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['n', 'yes', 'no'])
    if (!isNaN(Number(data.n))) {
      return { data: null, replacement: data.yes || '1' }
    }
    return { data: null, replacement: data.no || '' }
  },
  'order of magnitude': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['val'])
    const num = Math.abs(Number(data.val))
    if (!Number.isFinite(num) || num === 0) {
      return { data: null, replacement: '0' }
    }
    return { data: null, replacement: String(Math.floor(Math.log10(num))) }
  },
  'percent and number': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['number', 'total', 'decimals'])
    let n = Number(data.number) / Number(data.total)
    n *= 100
    let dec = Number(data.decimals) || 0
    return { data: null, replacement: `${n.toFixed(dec)}% (${Number(data.number).toLocaleString()})` }
  },
  music: (tmpl, parse = defaultParse) => {
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
      return { data: null, replacement: glyphs[data.glyph] }
    }
    return { data: null, replacement: '' }
  },
  simplenuclide: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['name', 'mass'])
    return { data: null, replacement: `[[${data.name}|${data.mass || ''}${data.name}]]` }
  },
  'font color': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['fg', 'bg', 'text'])
    if (data.bg && data.text) {
      return { data: null, replacement: data.text }
    }
    return { data: null, replacement: data.bg }
  },
  'colored link': (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['color', 'title', 'text'])
    return { data: null, replacement: `[[${data.title}|${data.text || data.title}]]` }
  },
  nftu: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['age', 'team'])
    return { data: null, replacement: `${data.team} U${data.age}` }
  },
  tls: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['name', 'one', 'two'])
    let out = `subst:${data.name}`
    if (data.one) {
      out += '|' + data.one
    }
    if (data.two) {
      out += '|' + data.two
    }
    return { data: null, replacement: `{{${out}}}` }
  },
}
