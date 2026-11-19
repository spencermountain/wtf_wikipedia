import findNested from './nested.ts'
import evaluateNode from './_lib.ts'
import type { DocInfo } from '../../../types/index.ts'

// Evaluate children before parents, collecting results in that same order.
const allTemplates = (wiki: string, opts: DocInfo) => {
  const roots = findNested(wiki)
  const state = { templates: [], remaining: wiki, room: wiki.length * 4 + 10000 }
  let out = ''
  let cursor = 0
  // step-into each root to parse it - they're in page order
  for (let i = 0; i < roots.length; i += 1) {
    const at = wiki.indexOf(roots[i].wiki, cursor)
    out += wiki.slice(cursor, at) + evaluateNode(roots[i], state, opts)
    cursor = at + roots[i].wiki.length
  }
  state.remaining = out + wiki.slice(cursor)
  return state
}

export default allTemplates
