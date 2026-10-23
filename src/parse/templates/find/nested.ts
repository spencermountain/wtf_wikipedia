import findFlat from './flat.ts'
import getName from '../parse/toJSON/_getName.ts'
import type { NestedNode } from '../types.ts'
const hasTemplate = /\{\{/

const createNode = (tmpl: string): NestedNode => {
  return {
    wiki: tmpl,
    body: tmpl,
    parserName: getName(tmpl),
    children: [],
  }
}

const findChildren = (obj: NestedNode) => {
  // Search inside this invocation's outer braces.
  let wiki = obj.body.slice(2)
  wiki = wiki.replace(/\}\}$/, '')

  // get our child templates
  const list = findFlat(wiki)
  obj.children = list.map(createNode)

  if (obj.children.length === 0) {
    return obj
  }
  for (let i = 0; i < obj.children.length; i += 1) {
    const child = obj.children[i]
    const inside = child.body.slice(2)
    if (hasTemplate.test(inside)) {
      findChildren(child)
    }
  }
  return obj
}

// return a nested structure of all templates
const findTemplates = (wiki: string) => {
  let list = findFlat(wiki)
  list = list.map(createNode)
  list = list.map(findChildren)
  return list
}

export default findTemplates
