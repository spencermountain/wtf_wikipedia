import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
const heading_reg = /^(={1,6})(.{1,200}?)={1,6}$/ //eslint-disable-line

//estimates the depth of a section and normalizes its title
const parseHeading = function (heading: string, opts: DocInfo = defaults) {
  let [_, prefix, title] = heading.match(heading_reg) || []
  if (!prefix || !title) {
    return { title: '', depth: 0 }
  }
  // count number of == characters to determine depth
  let depth = prefix.length - 2
  const block = parseBlock(title.trim(), opts)
  block.wiki = heading

  return { block, depth }
}

export default parseHeading
