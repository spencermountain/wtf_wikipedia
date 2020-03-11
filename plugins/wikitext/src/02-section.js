const defaults = {}
const toWiki = function(options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''
  if (this.title()) {
    let side = '=='
    text += `\n${side} ${this.title()} ${side}\n`
  }
  text += this.paragraphs()
    .map(p => {
      return p.wikitext(options)
    })
    .join('\n')
  return text
}
module.exports = toWiki
