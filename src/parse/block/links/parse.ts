import postprocess from '../../_lib/postprocess.ts'
import type { LinkData } from '../../../types/index'
import external_links from './external-links.ts'
import internal_links from './internal-links.ts'

//grab an array of internal links in the text
const parse_links = function (wiki: string) {
  let links: LinkData[] = []
  //first, parse external links
  links = external_links(wiki)
  //internal links
  links = links.concat(internal_links(wiki))
  if (links.length === 0) {
    return undefined
  }

  for (const link of links) {
    if (typeof link.text === 'string') {
      link.text = postprocess(link.text)
    }
  }

  return links
}
export default parse_links
