const parse = require('../_parsers/parse')

const misc = {
  'baseball secondary style': 0,
  mlbplayer: function(tmpl, r) {
    let obj = parse(tmpl, ['number', 'name', 'dl'])
    r.templates.push(obj)
    return obj.name
  }
}

module.exports = Object.assign({}, misc, require('./brackets'), require('./soccer'))
