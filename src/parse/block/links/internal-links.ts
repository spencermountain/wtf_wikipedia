import type { InternalLinkData } from '../../../types/index'
import parse_interwiki from './interwiki.ts'

const ignore_links =
  /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i
const link_reg = /\[\[((?:\[[^[\]\r\n]*\]|[^[\]\r\n]){0,1600})\]\]([a-z]+)?/gi //allow dangling suffixes - "[[flanders]]s"

const internal_links = function (wiki: string) {
  let links: InternalLinkData[] = []
  //regular links
  wiki.replace(link_reg, function (match, s, suffix) {
    let text = null
    //make a copy of original
    let link = s
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,1000}?)\]\](\w{0,10})/g, '$1$2') //remove ['s and keep suffix
      link = s.replace(/(.{2,1000})\|.{0,2000}/, '$1') //replaced links
      text = s.replace(/.{2,1000}?\|/, '')
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
      wiki: match,
    }
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b
      return ''
    })
    //grab any fr:Paris parts
    obj = parse_interwiki(obj)

    if (text !== null) {
      obj.text = text
    }
    //finally, support [[link]]'s apostrophe
    if (suffix) {
      obj.text ||= obj.page
      obj.text += suffix.trim()
    }
    //keep the display-text, for lowercase pages
    if (obj.page && /^[A-Z]/.test(obj.page) === false) {
      if (!obj.text) {
        obj.text = obj.page
      }
    }
    // support [[:Category:Foo]] syntax
    if (obj.text && obj.text.startsWith(':')) {
      obj.text = obj.text.replace(/^:/, '')
    }
    links.push(obj)
    return s
  })
  return links
}
export default internal_links
