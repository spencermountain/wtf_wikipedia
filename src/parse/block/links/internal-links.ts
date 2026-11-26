import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import type { InternalLinkData } from '../../../types/index'
import parse_interwiki from './interwiki.ts'
import normalizePage from './normalize-page.ts'

const ignore_links =
  /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i
const link_reg = /\[\[((?:\[[^[\]\r\n]*\]|[^[\]\r\n]){0,1600})\]\]([a-z]+)?/gi //allow dangling suffixes - "[[flanders]]s"

const internal_links = function (wiki: string, opts: DocInfo = defaults) {
  let links: InternalLinkData[] = []
  //regular links
  wiki.replace(link_reg, function (match, s, suffix) {
    let text = null
    //make a copy of original
    let link = s
    const pipe = s.indexOf('|')
    if (pipe > 0) {
      //replacement link [[link|text]] - the page ends at the first pipe
      link = s.slice(0, pipe)
      text = s.slice(pipe + 1)
      //handle funky case of [[toronto|]]
      if (text === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '')
        text = link
      }
    }
    //kill off non-wikipedia namespaces
    if (link.match(ignore_links)) {
      return s
    }
    //kill off just these just-anchor links [[#history]]
    // if (link.match(/^#/i)) {
    //   return s
    // }
    //remove anchors from end [[toronto#history]]
    let obj: InternalLinkData = {
      type: 'internal',
      page: link,
      text: '',
      wiki: match,
    }
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b
      return ''
    })
    obj.text = obj.page
    //grab any fr:Paris parts
    obj = parse_interwiki(obj, opts)

    if (text !== null && obj.inline !== false) {
      obj.text = text
    }
    //finally, support [[link]]'s apostrophe
    if (suffix && obj.inline !== false) {
      obj.text += suffix.trim()
    }
    // support [[:Category:Foo]] syntax
    if (obj.text && obj.text.startsWith(':')) {
      obj.text = obj.text.replace(/^:/, '')
    }
    obj.page = normalizePage(obj, opts)
    links.push(obj)
    return s
  })
  return links
}
export default internal_links
