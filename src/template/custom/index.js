const aliases = require('./aliases')

let templates = Object.assign(
  {},
  require('./text-only'),
  require('./data-only'),
  require('./text-and-data'),
  require('./text-and-data/custom/dates'),
  require('./text-and-data/custom/geo'),
  require('./text-and-data/custom/table-cell'),
  require('./text-and-data/custom/math'),
  require('./text-and-data/custom/misc'),
  require('./text-and-data/custom/science'),
  require('./text-and-data/custom/stock-exchanges'),
  require('./text-and-data/custom/weather'),
  require('./text-and-data/custom/sports/_lib'),
  require('./text-and-data/custom/sports/sports'),
  require('./text-and-data/custom/sports/_lib'),
  require('./text-and-data/custom/sports/sports')
)

Object.keys(aliases).forEach((k) => {
  // if (templates[aliases[k]] === undefined) {
  //   console.error(`Missing template: '${aliases[k]}'`)
  // }
  templates[k] = templates[aliases[k]]
})
module.exports = templates

// console.log(Object.keys(templates).length)
