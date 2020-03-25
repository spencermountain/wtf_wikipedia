const parse = require('../_parsers/parse')

const generic = function(tmpl, list, alias) {
  let obj = parse(tmpl)
  if (alias) {
    obj.name = obj.template
    obj.template = alias
  }
  list.push(obj)
  return ''
}

const misc = {
  //i18n templates
  persondata: generic,
  taxobox: generic,
  citation: generic,
  portal: generic,
  reflist: generic,
  'cite book': generic,
  'cite journal': generic,
  'cite web': generic,
  'commons cat': generic,

  // https://en.wikipedia.org/wiki/Template:Portuguese_name
  'portuguese name': ['first', 'second', 'suffix'],
  uss: ['ship', 'id'],
  isbn: (tmpl, list) => {
    let order = ['id', 'id2', 'id3']
    let obj = parse(tmpl, order)
    list.push(obj)
    return 'ISBN: ' + (obj.id || '')
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, list) => {
    let data = parse(tmpl, ['spouse', 'from', 'to', 'end'])
    list.push(data)
    let str = `${data.spouse || ''}`
    if (data.from) {
      if (data.to) {
        str += ` (m. ${data.from}-${data.to})`
      } else {
        str += ` (m. ${data.from})`
      }
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, list) => {
    let obj = parse(tmpl, ['title', 'author'])
    list.push(obj)
    return `${obj.title} by ${obj.author || ''}`
  },
  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, list) => {
    let order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4']
    let obj = parse(tmpl, order)
    let template = {
      template: 'video game release',
      releases: []
    }
    for (let i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]]
        })
      }
    }
    list.push(template)
    let str = template.releases.map(o => `${o.region}: ${o.date || ''}`).join('\n\n')
    return '\n' + str + '\n'
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
  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, list) => {
    let data = parse(tmpl)
    data.list = data.list || []
    let years = []
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1]
      years.push({
        year: data.list[i],
        val: Number(num) || num
      })
    }
    data.data = years
    delete data.list
    list.push(data)
    return ''
  }
}
module.exports = misc
