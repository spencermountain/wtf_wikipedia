import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import postprocess from '../../_lib/postprocess.ts'
import type { LinkData } from '../../../types/index'
import external_links from './external-links.ts'
import internal_links from './internal-links.ts'

//grab an array of internal links in the text
const parse_links = function (wiki: string, opts: DocInfo = defaults) {
  let links: LinkData[] = []
  //first, parse external links
  links = external_links(wiki, opts)
  //internal links
  links = links.concat(internal_links(wiki, opts))
  if (links.length === 0) {
    return undefined
  }
  // keep document order, rather than externals-first
  let cursor = 0
  const positions = links.map((link) => {
    const at = wiki.indexOf(link.wiki, cursor)
    if (at === -1) {
      return wiki.indexOf(link.wiki)
    }
    cursor = at + link.wiki.length
    return at
  })
  links = links
    .map((link, i) => ({ link, at: positions[i], i }))
    .sort((a, b) => a.at - b.at || a.i - b.i)
    .map((o) => o.link)

  for (const link of links) {
    if (typeof link.text === 'string') {
      link.text = postprocess(link.text).replace(/'{2,}/g, '')
    }
  }
  return links
}
export default parse_links
