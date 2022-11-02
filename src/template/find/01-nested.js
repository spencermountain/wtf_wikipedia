import findFlat from './02-flat.js'
import getName from '../parse/toJSON/_getName.js'
const hasTemplate = /\{\{/

function parseTemplate (tmpl) {
  // this is some unexplained Lua thing
  tmpl = tmpl.replace(/#invoke:/, '')
  return {
    body: tmpl,
    name: getName(tmpl),
    children: [],
  }
}

function doEach (obj) {
  // peel-off top-level
  let wiki = obj.body.substr(2)
  wiki = wiki.replace(/\}\}$/, '')

  // get our child templates
  obj.children = findFlat(wiki)
  obj.children = obj.children.map(parseTemplate)

  if (obj.children.length === 0) {
    return obj
  }
  // recurse through children
  obj.children.forEach((ch) => {
    let inside = ch.body.substr(2)
    if (hasTemplate.test(inside)) {
      return doEach(ch) //keep going
    }
    return null
  })
  return obj
}

// return a nested structure of all templates
function findTemplates (wiki) {
  let list = findFlat(wiki)
  list = list.map(parseTemplate)
  list = list.map(doEach)
  return list
}

export default findTemplates
