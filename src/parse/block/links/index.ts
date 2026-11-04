import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import parseLinks from './parse.ts'
import type { LinkData, BlockData } from '../../../types/index'

// [[File:with|Size]] - stop at the next opener, so that repeated unclosed ones don't each scan to the end of the line
const fileLink = /\[\[File:((?:(?!\[\[File:).){2,80}?)\|((?:(?!\[\[File:)[^\]])+)\]\](\w{0,5})/g

//return only rendered text of wiki links
const removeLinks = function (line: string) {
  line = line.replace(fileLink, '$1')
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
