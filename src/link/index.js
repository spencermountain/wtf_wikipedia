import Link from './Link.js'
import parseLinks from './parse.js'

//return only rendered text of wiki links
const removeLinks = function (line) {
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+)\]\](\w{0,5})/g, '$1')
  return line
}

const getLinks = function (data) {
  let wiki = data.text
  let links = parseLinks(wiki) || []
  data.links = links.map((link) => {
    wiki = wiki.replace(link.raw, link.text || link.page || '')
    // delete link.raw
    return new Link(link)
  })
  wiki = removeLinks(wiki)
  data.text = wiki
}
export default getLinks
