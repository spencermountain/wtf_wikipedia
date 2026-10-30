import findFlat from './flat.ts'
import getName from '../parse/toJSON/_getName.ts'
import type { NestedNode } from '../types.ts'
const hasTemplate = /\{\{/
// MediaWiki itself stops expanding at a nesting depth of 40 ($wgMaxTemplateDepth), so anything
// deeper is already broken on-wiki. Stopping here also keeps pathological pages from taking
// seconds to parse - evaluation cost grows ~cubically with depth.
const maxDepth = 40

const createNode = (tmpl: string): NestedNode => {
  return {
    wiki: tmpl,
    body: tmpl,
    parserName: getName(tmpl),
    children: [],
  }
}

const findChildren = (obj: NestedNode, depth = 1) => {
  // Search inside this invocation's outer braces.
  let wiki = obj.body.slice(2)
  wiki = wiki.replace(/\}\}$/, '')

  // get our child templates
  const list = findFlat(wiki)
  obj.children = list.map(createNode)

  if (obj.children.length === 0 || depth >= maxDepth) {
    // past the depth cap, deeper templates are left unparsed inside this one's text
    return obj
  }
  for (let i = 0; i < obj.children.length; i += 1) {
    const child = obj.children[i]
    const inside = child.body.slice(2)
    if (hasTemplate.test(inside)) {
      findChildren(child, depth + 1)
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
