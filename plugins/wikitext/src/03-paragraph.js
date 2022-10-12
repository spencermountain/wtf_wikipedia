const defaults = {}

function toWiki (options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''

  // do images
  this.images().forEach((img) => {
    text += img.makeWikitext()
  })
  // do lists
  this.lists().forEach((list) => {
    text += list.makeWikitext()
  })
  // render sentences
  text += this.sentences()
    .map((s) => {
      return s.makeWikitext(options)
    })
    .join('\n')
  return text
}
export default toWiki
