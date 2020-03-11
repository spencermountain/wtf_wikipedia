const defaults = {}

const toWiki = function(options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = this.sentences().map(s => {
    return s.wikitext(options)
  })
  return text.join('\n')
}
module.exports = toWiki
