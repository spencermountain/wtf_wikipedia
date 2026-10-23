import parseArguments from './index.ts'
import simplifyArguments from './simplify.ts'
import type { DocInfo } from '../../../../types/index.ts'

const parseTextArguments = (wiki: string, order = [], opts?: DocInfo) => {
  return simplifyArguments(parseArguments(wiki, order, opts))
}

export default parseTextArguments
