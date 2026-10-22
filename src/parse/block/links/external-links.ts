import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import type { ExternalLinkData } from '../../../types/index'

const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g

const external_links = function (wiki: string, _opts: DocInfo = defaults) {
  let links: ExternalLinkData[] = []
  wiki.replace(external_link, function (match, protocol, link, text) {
    text ||= ''
    const obj: ExternalLinkData = {
      type: 'external',
      site: protocol + link,
      text: text.trim(),
      wiki: match,
    }
    links.push(obj)
    return text
  })
  return links
}
export default external_links
