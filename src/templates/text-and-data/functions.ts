import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

let templates = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['formula'])
    // {{math}} is inline (it is <math> that is a block)
    return { data: obj, replacement: obj.formula || '' }
  },

  //svg labels - https://en.m.wikipedia.org/wiki/Template:Legend
  legend: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['color', 'label'])
    // return obj.label || ' '
    return { data: obj, replacement: tmpl } // keep the wiki?
  },

  isbn: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['id', 'id2', 'id3'])
    return { data: obj, replacement: 'ISBN ' + (obj.id || '') }
  },

  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['title', 'author'])
    return { data: obj, replacement: `${obj.title} by ${obj.author || ''}` }
  },

  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  'bbl to t': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['barrels'])
    if (obj.barrels === '0') {
      return { data: obj, replacement: obj.barrels + ' barrel' }
    }
    return { data: obj, replacement: obj.barrels + ' barrels' }
  },

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['number', 'text'])
    return {
      data: obj,
      replacement: `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`,
    }
  },

  pengoal: (_tmpl) => {
    const payload = {
      template: 'pengoal',
    }
    return { data: payload, replacement: '✅' }
  },

  penmiss: (_tmpl) => {
    const payload = {
      template: 'penmiss',
    }
    return { data: payload, replacement: '❌' }
  },

  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    obj.list ||= []
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`)
    return { data: obj, replacement: lines.join('\n\n') }
  },

  // https://en.wikipedia.org/wiki/Template:Title_year
  'title year': (tmpl, parse = defaultParse, info) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || info?.title
    if (title) {
      let m = title.match(/\b[0-9]{4}\b/) //parse the year out of the title's name
      if (m) {
        return { data: null, replacement: m[0] }
      }
    }
    return { data: null, replacement: obj.nomatch || '' } //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_century
  'title century': (tmpl, parse = defaultParse, info?) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || info?.title
    if (title) {
      let m = title.match(/\b([0-9]+)(st|nd|rd|th)\b/) //parse the century out of the title's name
      if (m) {
        return { data: null, replacement: m[1] || '' }
      }
    }
    return { data: null, replacement: obj.nomatch || '' } //use default response
  },

  // https://en.wikipedia.org/wiki/Template:Title_decade
  'title decade': (tmpl, parse = defaultParse, info?) => {
    let obj = parse(tmpl, ['match', 'nomatch', 'page'])
    let title = obj.page || info?.title
    if (title) {
      let m = title.match(/\b([0-9]+)s\b/) //parse the decade out of the title's name
      if (m) {
        return { data: null, replacement: m[1] || '' }
      }
    }
    return { data: null, replacement: obj.nomatch || '' } //use default response
  },

  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['english', 'kanji', 'romaji', 'extra', 'extra2'])
    // {{nihongo foot}} moves the kanji and romaji into a footnote
    if (obj.template === 'nihongo foot') {
      return { data: obj, replacement: obj.english || obj.romaji || '' }
    }
    // {{nihongo3|english|kanji|romaji}} → romaji (kanji, english)
    let str = obj.english || obj.romaji || ''
    let details = [obj.kanji, obj.romaji]
    if (obj.template === 'nihongo3') {
      str = obj.romaji || obj.english || ''
      details = [obj.kanji, obj.english]
    }
    details = details.filter((s) => s && s !== str)
    if (obj.extra) {
      details.push(obj.extra)
    }
    if (details.length > 0) {
      str += ` (${details.join(', ')})`
    }
    if (obj.extra2) {
      str += ' ' + obj.extra2
    }
    return { data: obj, replacement: str }
  },

  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['spouse', 'from', 'to', 'end'])
    let str = data.spouse || ''
    if (data.from) {
      if (data.to) {
        // {{marriage|Jane|2001|2010|end=died}} → Jane (m. 2001; died 2010)
        const reasons = {
          died: 'died',
          'd.': 'died',
          dead: 'died',
          widowed: 'died',
          div: 'div.',
          'div.': 'div.',
          divorced: 'div.',
          ann: 'ann.',
          'ann.': 'ann.',
          annulled: 'ann.',
          sep: 'sep.',
          'sep.': 'sep.',
          separated: 'sep.',
        }
        let reason = reasons[(data.end || '').toLowerCase()]
        if (reason) {
          str += ` (m. ${data.from}; ${reason} ${data.to})`
        } else {
          str += ` (m. ${data.from}–${data.to})`
        }
      } else {
        str += ` (m. ${data.from})`
      }
    }
    return { data: data, replacement: str }
  },

  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['cards'])
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || [],
    }
    let mins = result.minutes.map((m) => m + "'").join(', ')
    return { data: result, replacement: 'sent off: ' + mins }
  },

  transl: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['lang', 'text', 'text2'])
    // support 3-param
    if (obj.text2) {
      obj.iso = obj.text
      obj.text = obj.text2
      delete obj.text2
    }
    return { data: obj, replacement: obj.text || '' }
  },

  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
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
    str += '\n' + obj.list.join('\n\n') + '\n'
    return { data: obj, replacement: str }
  },

  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, parse = defaultParse) => {
    let arr = parse(tmpl).list || []
    let str = arr[0] || ''
    let lines = str.split(/\n/).filter((f) => f)
    lines = lines.map((s) => s.replace(/\*/, ''))
    const payload = {
      template: 'columns-list',
      list: lines,
    }
    lines = lines.map((s) => '• ' + s)
    return { data: payload, replacement: lines.join('\n\n') }
  },

  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    let result = []
    let units = ['m', 'cm', 'ft', 'in'] //order matters
    units.forEach((unit) => {
      if (Object.hasOwn(obj, unit) === true) {
        result.push(obj[unit] + ' ' + unit)
      }
    })
    return { data: obj, replacement: result.join(' ') }
  },

  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['one', 'two', 'three'])
    let parts = [obj.one, obj.two, obj.three]
    //support '[sic?]' - the '?' may sit in any position
    let question = parts.includes('?') || obj['?'] === 'y'
    let word = parts.filter((s) => s && s !== '?').join('')
    const payload = {
      template: 'sic',
      word: word,
    }
    // hide=y suppresses the visible [sic] (nolink=y only removes the wikilink)
    if (obj.hide === 'y' || obj.hide === 'yes') {
      return { data: payload, replacement: word }
    }
    return { data: payload, replacement: `${word} [sic${question ? '?' : ''}]` }
  },

  //
  inrconvert: (tmpl, parse = defaultParse) => {
    let o = parse(tmpl, ['rupee_value', 'currency_formatting'])
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
    return { data: o, replacement: `inr ${o.rupee_value || ''}` }
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  sfrac: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['a', 'b', 'c'])
    let data: any = {
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
    if (data.integer) {
      return { data: data, replacement: `${data.integer} ${data.numerator}⁄${data.denominator}` }
    }
    return { data: data, replacement: `${data.numerator}⁄${data.denominator}` }
  },

  'winning percentage': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['wins', 'losses', 'ties'])
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
    if (!Number.isFinite(wins) || !Number.isFinite(games) || games <= 0) {
      return { data: obj, replacement: '' }
    }
    let result = (wins / games).toFixed(3)
    if (obj.leading_zero !== 'y') {
      result = result.replace(/^0\./, '.')
    }
    // {{winpct|94|68|record=y}} → '94–68 (.580)'
    if (obj.record === 'y') {
      const rec = [obj.wins, obj.losses]
      if (obj.ties) {
        rec.push(obj.ties)
      }
      return { data: obj, replacement: `${rec.join('–')} (${result})` }
    }
    return { data: obj, replacement: result }
  },

  // https://en.wikipedia.org/wiki/Template:Winlosspct
  // {{winlosspct|10|5}} → 10 || 5 || .667
  winlosspct: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['wins', 'losses'])
    let wins = Number(obj.wins) || 0
    let losses = Number(obj.losses) || 0
    let games = wins + losses
    let out = '-'
    if (games > 0) {
      out = (wins / games).toFixed(3).replace(/^0\./, '.')
    }
    return { data: obj, replacement: `${wins} || ${losses} || ${out}` }
  },

  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, parse = defaultParse) => {
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
    let str = template.releases.map((o) => `${o.region}: ${o.date || ''}`).join('\n\n')
    return { data: template, replacement: '\n' + str + '\n' }
  },
  // https://en.m.wikipedia.org/wiki/Template:USS
  uss: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['name', 'id'])
    if (obj.id) {
      return { data: obj, replacement: `[[USS ${obj.name} (${obj.id})|USS ''${obj.name}'' (${obj.id})]]` }
    }
    return { data: obj, replacement: `[[USS ${obj.name}|USS ''${obj.name}'']]` }
  },
  // https://en.wikipedia.org/wiki/Template:Blockquote
  blockquote: (tmpl, parse = defaultParse) => {
    let props = ['text', 'author', 'title', 'source', 'character']
    let obj = parse(tmpl, props)
    let txt = obj.text
    // used first un-named param
    if (!txt) {
      obj.list ||= []
      txt = obj.list[0] || ''
    }
    // replace double quotes with singles and put the text inside double quotes
    let result = txt.replace(/"/g, "'")
    result = '"' + result + '"'
    return { data: obj, replacement: result }
  },

  // https://de.m.wikipedia.org/wiki/Vorlage:ReptileDatabase
  // {{ReptileDatabase|Blanus|cinereus}} → Blanus cinereus In: The Reptile Database
  reptiledatabase: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['genus', 'species', 'abruf', 'pure_url'])
    let str = ''
    if (obj.genus || obj.species) {
      str = `${obj.genus || ''} ${obj.species || ''} `
    }
    return { data: obj, replacement: `${str}In: [[The Reptile Database]]` }
  },
  //https://en.m.wikipedia.org/wiki/Template:GEOnet3
  geonet3: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['ufi', 'name'])
    return {
      data: obj,
      replacement: `GEOnet3 can be found at [[GEOnet Names Server]], at [http://geonames.nga.mil/namesgaz/ this link]`,
    }
  },
  'poem quote': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['text', 'char', 'sign', 'source', 'title'])
    let out = obj.text || ''
    if (obj.char || obj.sign || obj.source || obj.title) {
      out += '\n\n —'
      out += obj.char ? ' ' + obj.char : ''
      out += obj.sign ? ' ' + obj.sign : ''
      out += obj.source ? ' ' + obj.source : ''
      out += obj.title ? ' ' + obj.title : ''
    }
    return { data: obj, replacement: out }
  },
  tweet: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    let out = obj.text || ''
    out += obj.date ? ' ' + obj.date : ''
    return { data: obj, replacement: out }
  },
}
export default templates
