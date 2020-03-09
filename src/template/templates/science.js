const parse = require('../_parsers/parse')

let templates = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': ['taxon', 'item'],

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, list) => {
    let obj = parse(tmpl, ['number', 'text'])
    list.push(obj)
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text ||
      obj.number}]`
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: (tmpl, list) => {
    let obj = parse(tmpl, ['equation'])
    list.push(obj)
    return obj.equation
  }, //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, list) => {
    let obj = parse(tmpl, [
      'asc_hours',
      'asc_minutes',
      'asc_seconds',
      'dec_sign',
      'dec_degrees',
      'dec_minutes',
      'dec_seconds',
      'distance'
    ])
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds
      },
      distance: obj.distance
    }
    list.push(template)
    return ''
  }
}
module.exports = templates
