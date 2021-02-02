const aliases = require('./aliases')

let templates = Object.assign({}, require('./text-only'), require('./data-only'), require('./text-and-data'))

Object.keys(aliases).forEach((k) => {
  // if (templates[aliases[k]] === undefined) {
  //   console.error(`Missing template: '${aliases[k]}'`)
  // }
  templates[k] = templates[aliases[k]]
})
module.exports = templates

// console.log(Object.keys(templates).length)
