import parse_interwiki from './interwiki.js'
const ignore_links =
  /^:?(category|catégorie|kategorie|categoría|categoria|categorie|kategoria|تصنيف|image|file|fichier|datei|media):/i
const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]| ]{4,1500})([| ].*?)?\]/g
const link_reg = /\[\[(.{0,160}?)\]\]([a-z]+)?/gi //allow dangling suffixes - "[[flanders]]s"

function external_links (links, str) {
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

function internal_links (links, str) {
  //regular links
  str.replace(link_reg, function (raw, s, suffix) {
    let txt = null
    //make a copy of original
    let link = s
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,100}?)\]\](\w{0,10})/g, '$1$2') //remove ['s and keep suffix
      link = s.replace(/(.{2,100})\|.{0,200}/, '$1') //replaced links
      txt = s.replace(/.{2,100}?\|/, '')
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
    //   console.log(s)
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
    links.push(obj)
    return s
  })
  return links
}

//grab an array of internal links in the text
function parse_links (str) {
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
