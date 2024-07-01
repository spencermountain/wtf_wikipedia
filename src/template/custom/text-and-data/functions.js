import parse from '../../parse/toJSON/index.js'
import { percentage } from '../_lib.js'

let templates = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, list) => {
    let obj = parse(tmpl, ['formula'])
    list.push(obj)
    return '\n\n' + (obj.formula || '') + '\n\n'
  },

  //svg labels - https://en.m.wikipedia.org/wiki/Template:Legend
  legend: (tmpl, list) => {
    let obj = parse(tmpl, ['color', 'label'])
    list.push(obj)
    // return obj.label || ' '
    return tmpl // keep the wiki?
  },

  isbn: (tmpl, list) => {
    let obj = parse(tmpl, ['id', 'id2', 'id3'])
    list.push(obj)
    return 'ISBN ' + (obj.id || '')
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

  pengoal: (_tmpl, list) => {
    list.push({
      template: 'pengoal',
    })
    return '✅'
  },

  penmiss: (_tmpl, list) => {
    list.push({
      template: 'penmiss',
    })
    return '❌'
  },

  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    obj.list = obj.list || []
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`)
    return lines.join('\n\n')
  },

  // https://en.wikipedia.org/wiki/Template:Title_year
  'title year': (tmpl, _list, _alias, _parse, doc) => {
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
  'title century': (tmpl, _list, _alias, _parse, doc) => {
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
  'title decade': (tmpl, _list, _alias, _parse, doc) => {
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

  //
  inrconvert: (tmpl, list) => {
    let o = parse(tmpl, ['rupee_value', 'currency_formatting'])
    list.push(o)
    const mults = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000,
      l: 100000,
      c: 10000000,
      lc: 1000000000000,
    }
    if (o.currency_formatting) {
      let multiplier = mults[o.currency_formatting] || 1
      o.rupee_value = o.rupee_value * multiplier
    }
    return `inr ${o.rupee_value || ''}`
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  frac: (tmpl, list) => {
    let obj = parse(tmpl, ['a', 'b', 'c'])
    let data = {
      template: 'sfrac',
    }
    if (obj.c) {
      data.integer = obj.a
      data.numerator = obj.b
      data.denominator = obj.c
    } else if (obj.b) {
      data.numerator = obj.a
      data.denominator = obj.b
    } else {
      data.numerator = 1
      data.denominator = obj.a
    }
    list.push(data)
    if (data.integer) {
      return `${data.integer} ${data.numerator}⁄${data.denominator}`
    }
    return `${data.numerator}⁄${data.denominator}`
  },

  'winning percentage': (tmpl, list) => {
    let obj = parse(tmpl, ['wins', 'losses', 'ties'])
    list.push(obj)
    let wins = Number(obj.wins)
    let losses = Number(obj.losses)
    let ties = Number(obj.ties) || 0
    let games = wins + losses + ties
    if (obj.ignore_ties === 'y') {
      ties = 0
    }
    if (ties) {
      wins += ties / 2
    }
    let num = percentage({
      numerator: wins,
      denominator: games,
      decimals: 1,
    })
    if (num === null) {
      return ''
    }
    return `.${num * 10}`
  },

  winlosspct: (tmpl, list) => {
    let obj = parse(tmpl, ['wins', 'losses'])
    list.push(obj)
    let wins = Number(obj.wins)
    let losses = Number(obj.losses)
    let num = percentage({
      numerator: wins,
      denominator: wins + losses,
      decimals: 1,
    })
    if (num === null) {
      return ''
    }
    let out = `.${num * 10}`
    return `${wins || 0} || ${losses || 0} || ${out || '-'}`
  },

  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, list) => {
    let order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4']
    let obj = parse(tmpl, order)
    let template = {
      template: 'video game release',
      releases: [],
    }
    for (let i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]],
        })
      }
    }
    list.push(template)
    let str = template.releases.map((o) => `${o.region}: ${o.date || ''}`).join('\n\n')
    return '\n' + str + '\n'
  },
  // https://en.m.wikipedia.org/wiki/Template:USS
  uss: (tmpl, list) => {
    let obj = parse(tmpl, ['name', 'id'])
    list.push(obj)
    if (obj.id) {
      return `[[USS ${obj.name} (${obj.id})|USS ''${obj.name}'' (${obj.id})]]`
    }
    return `[[USS ${obj.name}|USS ''${obj.name}'']]`
  },
  // https://en.wikipedia.org/wiki/Template:Blockquote
  blockquote: (tmpl, list) => {
    let props = ['text', 'author', 'title', 'source', 'character']
    let obj = parse(tmpl, props)
    list.push(obj)
    let txt = obj.text
    // used first un-named param
    if (!txt) {
      obj.list = obj.list || []
      txt = obj.list[0] || ''
    }
    // replace double quotes with singles and put the text inside double quotes
    let result = txt.replace(/"/g, "'")
    result = '"' + result + '"'
    return result
  },

  // https://de.m.wikipedia.org/wiki/Vorlage:ReptileDatabase
  ReptileDatabase: (tmpl, list) => {
    let obj = parse(tmpl, ['taxon', 'genus', 'species', 'abruf', 'pure_url'])
    list.push(obj)
    let str = ''
    if (obj.genus || obj.species) {
      str = `${obj.genus || ''} ${obj.species || ''} `
    }
    return `${str}In: [[The Reptile Database]]`
  },
  //https://en.m.wikipedia.org/wiki/Template:GEOnet3
  GEOnet3: (tmpl, list) => {
    let obj = parse(tmpl, ['ufi', 'name'])
    list.push(obj)
    return `GEOnet3 can be found at [[GEOnet Names Server]], at [http://geonames.nga.mil/namesgaz/ this link]`
  },
  'poem quote': (tmpl, list) => {
    let obj = parse(tmpl, ['text', 'char', 'sign', 'source', 'title'])
    list.push(obj)
    let out = obj.text || ''
    if (obj.char || obj.sign || obj.source || obj.title) {
      out += '\n\n —'
      out += obj.char ? ' ' + obj.char : ''
      out += obj.sign ? ' ' + obj.sign : ''
      out += obj.source ? ' ' + obj.source : ''
      out += obj.title ? ' ' + obj.title : ''
    }
    return out
  },
  tweet: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let out = obj.text || ''
    out += obj.date ? ' ' + obj.date : ''
    return out
  },
}
export default templates
