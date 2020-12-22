const aliases = require('./05-aliases')

let templates = Object.assign(
  {},
  require('./01-functions'),
  require('./02-inline-text'),
  require('./03-inline-number'),
  require('./04-inline-arrays'),

  require('./dates'),
  require('./formatting'),
  require('./geo'),
  require('./geo/flags'),
  require('./wikipedia'),
  require('./formatting/ipa'),

  require('./misc/currency'),
  require('./misc/languages'),
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
  templates[k] = templates[aliases[k]]
})
module.exports = templates
