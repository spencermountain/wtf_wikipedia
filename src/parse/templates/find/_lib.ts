import parseTemplate from '../parse/index.ts'
import type { DocInfo } from '../../../types/index.ts'
import type { NestedNode } from '../types.ts'

const replaceInAncestors = (node: NestedNode, body: string, replacement: string) => {
  if (node.parent) {
    node.parent.body = node.parent.body.replace(body, () => replacement)
    replaceInAncestors(node.parent, body, replacement)
  }
}

const evaluateNode = (node: NestedNode, parent: NestedNode | null, state, opts: DocInfo) => {
  node.parent = parent
  // Children update this node's body before its handler runs.
  const children = node.children
  for (let i = 0; i < children.length; i += 1) {
    evaluateNode(children[i], node, state, opts)
  }

  const { replacement, result } = parseTemplate(node.body, node.parserName, opts)
  if (result) {
    result.wiki = node.wiki
    state.templates.push(result)
  }

  // Expanded equals signs are value text, not outer parameter assignments.
  const argumentValue = String(replacement).replace(/=/g, '&#61;')
  // Keep every ancestor and the document synchronized using the current body.
  replaceInAncestors(node, node.body, argumentValue)
  const output = parent ? argumentValue : replacement
  // A callback inserts literal output, including replacement tokens such as $&.
  state.remaining = state.remaining.replace(node.body, () => output)
}

export default evaluateNode
