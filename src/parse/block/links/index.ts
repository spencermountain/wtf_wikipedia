import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import parseLinks from './parse.ts'
import type { LinkData, BlockData } from '../../../types/index'

//return only rendered text of wiki links
const removeLinks = function (line: string) {
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+)\]\](\w{0,5})/g, '$1')
  return line
}

const fromBlock = function (block: BlockData, opts: DocInfo = defaults) {
  let wiki = block.text
  let links: LinkData[] = parseLinks(wiki, opts) || []
  if (links.length > 0) {
    block.links = links.map((link) => {
      wiki = wiki.replace(link.wiki, () => link.text)
      return link
    })
    wiki = removeLinks(wiki)
    block.text = wiki
  }
}
export default fromBlock
