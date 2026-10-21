import findFlat from './02-flat.ts'
import getName from '../parse/toJSON/_getName.ts'
import type { NestedNode } from '../types.ts'
const hasTemplate = /\{\{/

const parseTemplate = function (tmpl: string): NestedNode {
  // this is some unexplained Lua thing
  return {
    body: tmpl,
    name: getName(tmpl),
    children: [],
  }
}

const doEach = function (obj: NestedNode) {
  // peel-off top-level
  let wiki = obj.body.slice(2)
  wiki = wiki.replace(/\}\}$/, '')

  // get our child templates
  const list = findFlat(wiki)
  obj.children = list.map(parseTemplate)

  if (obj.children.length === 0) {
    return obj
  }
  // recurse through children
  obj.children.forEach((ch) => {
    let inside = ch.body.slice(2)
    if (hasTemplate.test(inside)) {
      return doEach(ch) //keep going
    }
    return null
  })
  return obj
}

// return a nested structure of all templates
const findTemplates = function (wiki: string) {
  let list = findFlat(wiki)
  list = list.map(parseTemplate)
  list = list.map(doEach)
  return list
}

export default findTemplates
