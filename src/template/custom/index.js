/* eslint-disable no-console */
import aliases from './aliases.js'
import textTmpl from './text-only/index.js'
import dataTmpl from './data-only/index.js'
import bothTmpl from './text-and-data/index.js'

let templates = Object.assign({}, textTmpl, dataTmpl, bothTmpl)

Object.keys(aliases).forEach((k) => {
  if (templates[aliases[k]] === undefined) {
    console.error(`Missing template: '${aliases[k]}'`)
  }
  templates[k] = templates[aliases[k]]
})
export default templates
