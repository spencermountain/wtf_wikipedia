const Link = require('./Link')
const parseLinks = require('./parse')
const i18n = require('../_data/i18n')
const cat_reg = new RegExp(
  '\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]',
  'gi'
)

//return only rendered text of wiki links
const removeLinks = function(line) {
  // categories, images, files
  line = line.replace(cat_reg, '')
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2')
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1')
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$2$3')
  // External links
  line = line.replace(
    /\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g,
    '$2'
  )
  return line
}
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

const getLinks = function(wiki, data) {
  data.links = parseLinks(wiki)
  wiki = removeLinks(wiki)
  return wiki
}
module.exports = getLinks
