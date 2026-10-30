import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
import parseTemplates from '../../templates/index.ts'
import extractReferences from '../../02-section/03-references/extract.ts'
const heading_reg = /^(=+)(.{1,200}?)(=+)$/ //eslint-disable-line

//estimates the depth of a section and normalizes its title
const parseHeading = function (heading: string, opts: DocInfo = defaults) {
  let [_, prefix, title, suffix] = heading.match(heading_reg) || []
  if (!prefix || !title) {
    return { block: parseBlock('', opts), depth: 0, references: [] }
  }
  // MediaWiki uses the smaller side as the level, and keeps the extra '=' in the title
  const level = Math.min(prefix.length, suffix.length, 6)
  title = '='.repeat(prefix.length - level) + title + '='.repeat(suffix.length - level)
  // '==' is depth 0; a rare '=' heading is clamped to it
  let depth = Math.max(level - 2, 0)
  // a heading may carry a reference - keep it for the section
  const { wiki, citations } = extractReferences(title.trim(), opts)
  const references = citations.filter((c) => !c.reuse).flatMap((c) => c.references)
  const { remaining } = parseTemplates(wiki.trim(), opts)
  const block = parseBlock(remaining.trim(), opts)
  block.wiki = heading

  return { block, depth, references }
}

export default parseHeading
