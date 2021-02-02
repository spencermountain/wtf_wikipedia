const parse = require('../../toJSON')

const generic = function (tmpl, list, alias) {
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

  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, list) => {
    let data = parse(tmpl)
    data.list = data.list || []
    let years = []
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1]
      years.push({
        year: data.list[i],
        val: Number(num) || num,
      })
    }
    data.data = years
    delete data.list
    list.push(data)
    return ''
  },

  graph: (tmpl, list) => {
    let data = parse(tmpl)
    if (data.x) {
      data.x = data.x.split(',').map((str) => str.trim())
    }
    if (data.y) {
      data.y = data.y.split(',').map((str) => str.trim())
    }
    let y = 1
    while (data['y' + y]) {
      data['y' + y] = data['y' + y].split(',').map((str) => str.trim())
      y += 1
    }
    list.push(data)
    return ''
  },
}
module.exports = misc
