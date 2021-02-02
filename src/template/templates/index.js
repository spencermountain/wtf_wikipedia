const aliases = require('./05-aliases')

let templates = Object.assign(
  {},
  require('./01-functions'),
  require('./02-inline-text'),
  require('./03-inline-number'),
  require('./04-inline-arrays'),
  require('./custom/formatting'),

  require('./custom/dates'),
  require('./custom/geo'),
  require('./custom/flags'),
  require('./custom/wikipedia'),
  require('./custom/table-cell'),

  require('./custom/currency'),
  require('./custom/math'),
  require('./custom/misc'),
  require('./custom/science'),
  require('./custom/stock-exchanges'),
  require('./custom/weather'),
  require('./custom/sports/_lib'),
  require('./custom/sports/sports'),
  require('./custom/sports/_lib'),
  require('./custom/sports/sports')
)

Object.keys(aliases).forEach((k) => {
  // if (templates[aliases[k]] === undefined) {
  //   console.error(`Missing template: '${aliases[k]}'`)
  // }
  templates[k] = templates[aliases[k]]
})
module.exports = templates

// console.log(Object.keys(templates).length)
