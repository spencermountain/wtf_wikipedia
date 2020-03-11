const defaults = {}
const toWiki = function(options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = this.paragraphs().map(p => {
    return p.wikitext(options)
  })
  return text.join('\n')
}
module.exports = toWiki
