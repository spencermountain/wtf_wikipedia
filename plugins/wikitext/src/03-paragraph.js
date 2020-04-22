const defaults = {}

const toWiki = function (options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''

  // do images
  this.images().forEach((img) => {
    text += img.wikitext()
  })
  // do lists
  this.lists().forEach((list) => {
    text += list.wikitext()
  })
  // render sentences
  text += this.sentences()
    .map((s) => {
      return s.wikitext(options)
    })
    .join('\n')
  return text
}
module.exports = toWiki
