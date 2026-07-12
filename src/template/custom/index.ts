/* eslint-disable no-console */
import aliases from './aliases.ts'
import textTmpl from './text-only/index.ts'
import dataTmpl from './data-only/index.ts'
import bothTmpl from './text-and-data/index.ts'

let templates = Object.assign({}, textTmpl, dataTmpl, bothTmpl)

Object.keys(aliases).forEach((k) => {
  if (templates[aliases[k]] === undefined) {
    console.error(`Missing template: '${aliases[k]}'`)
  }
  templates[k] = templates[aliases[k]]
})
export default templates
