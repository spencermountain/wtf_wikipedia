const parse = require('../../parse/toJSON')

let templates = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, list) => {
    let obj = parse(tmpl, ['formula'])
    list.push(obj)
    return '\n\n' + (obj.formula || '') + '\n\n'
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

  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    obj.list = obj.list || []
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`)
    return lines.join('\n\n')
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
}
module.exports = templates
