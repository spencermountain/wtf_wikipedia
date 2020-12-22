const aliases = require('./05-aliases')

let templates = Object.assign(
  {},
  require('./01-functions'),
  require('./02-inline-text'),
  require('./03-inline-number'),
  require('./04-inline-arrays'),

  require('./formatting/format'),
  require('./formatting/ipa'),
  require('./formatting/lists'),
  require('./formatting/misc'),

  require('./dates'),
  require('./geo'),
  require('./geo/flags'),
  require('./wikipedia/links'),
  require('./wikipedia/page'),
  require('./wikipedia/table-cell'),

  require('./misc/currency'),
  require('./misc/math'),
  require('./misc/misc'),
  require('./misc/science'),
  require('./misc/stock-exchanges'),
  require('./misc/weather'),
  require('./sports/brackets'),
  require('./sports/soccer'),
  require('./sports/sports')
)

Object.keys(aliases).forEach((k) => {
  // if (templates[aliases[k]] === undefined) {
  //   console.error(`Missing template: '${aliases[k]}'`)
  // }
  templates[k] = templates[aliases[k]]
})
module.exports = templates
