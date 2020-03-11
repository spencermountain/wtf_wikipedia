const defaults = {
  images: true,
  tables: true,
  lists: true,
  links: true,
  paragraphs: true
}
const toWiki = function(options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''
  //render each section
  text += this.data.sections.map(s => s.wikitext(options)).join('\n')
  return text
}
module.exports = toWiki
