import parseTemplate from '../parse/index.ts'
import type { DocInfo } from '../../../types/index.ts'
import type { NestedNode } from '../types.ts'

// Evaluate a template's children, then the template. Returns the text to replace it with.
const evaluateNode = (node: NestedNode, state, opts: DocInfo) => {
  let body = ''
  let cursor = 0
  // Children update this node's body before its handler runs - in page order, in one pass.
  node.children.forEach((child) => {
    const at = node.body.indexOf(child.wiki, cursor)
    // Expanded equals signs are value text, not outer parameter assignments.
    body += node.body.slice(cursor, at) + evaluateNode(child, state, opts).replace(/=/g, '&#61;')
    cursor = at + child.wiki.length
  })
  node.body = body + node.body.slice(cursor)

  const { replacement, result } = parseTemplate(node.body, node.parserName, opts)
  if (result) {
    result.wiki = node.wiki
    state.templates.push(result)
  }

  // Nested templates can double the text at each level, so expansion can only grow it so far.
  const output = String(replacement)
  const grown = output.length - node.body.length
  if (grown > state.room) {
    return ''
  }
  state.room -= Math.max(0, grown)
  return output
}

export default evaluateNode
