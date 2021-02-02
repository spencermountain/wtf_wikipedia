const parse = require('../../parse/toJSON')

module.exports = {
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
