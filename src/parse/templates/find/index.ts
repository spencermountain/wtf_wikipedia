import findNested from './nested.ts'
import evaluateNode from './_lib.ts'
import type { DocInfo } from '../../../types/index.ts'

// Evaluate children before parents, collecting results in that same order.
const allTemplates = (wiki: string, opts: DocInfo) => {
  const roots = findNested(wiki)
  const state = { templates: [], remaining: wiki }
  // step-into each root to parse it
  for (let i = 0; i < roots.length; i += 1) {
    evaluateNode(roots[i], null, state, opts)
  }
  return state
}

export default allTemplates
