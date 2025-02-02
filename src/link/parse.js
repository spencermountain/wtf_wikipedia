import parse_interwiki from './interwiki.js'
const ignore_links =
  /^(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i
const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g
const link_reg = /\[\[(.{0,1600}?)\]\]([a-z]+)?/gi //allow dangling suffixes - "[[flanders]]s"

const external_links = function (links, str) {
  str.replace(external_link, function (raw, protocol, link, text) {
    text = text || ''
    links.push({
      type: 'external',
      site: protocol + link,
      text: text.trim(),
      raw: raw,
    })
    return text
  })
  return links
}

const internal_links = function (links, str) {
  //regular links
  str.replace(link_reg, function (raw, s, suffix) {
    let txt = null
    //make a copy of original
    let link = s
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,1000}?)\]\](\w{0,10})/g, '$1$2') //remove ['s and keep suffix
      link = s.replace(/(.{2,1000})\|.{0,2000}/, '$1') //replaced links
      txt = s.replace(/.{2,1000}?\|/, '')
      //handle funky case of [[toronto|]]
      if (txt === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '')
        txt = link
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
    let obj = {
      page: link,
      raw: raw,
    }
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b
      return ''
    })
    //grab any fr:Paris parts
    obj = parse_interwiki(obj)
    if (obj.wiki) {
      obj.type = 'interwiki'
    }
    if (txt !== null && txt !== obj.page) {
      obj.text = txt
    }
    //finally, support [[link]]'s apostrophe
    if (suffix) {
      obj.text = obj.text || obj.page
      obj.text += suffix.trim()
    }
    //titlecase it, if necessary
    if (obj.page && /^[A-Z]/.test(obj.page) === false) {
      if (!obj.text) {
        obj.text = obj.page
      }
      obj.page = obj.page
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

//grab an array of internal links in the text
const parse_links = function (str) {
  let links = []
  //first, parse external links
  links = external_links(links, str)
  //internal links
  links = internal_links(links, str)
  if (links.length === 0) {
    return undefined
  }
  return links
}
export default parse_links
