const toWiki = function () {
  let text = `[[${this.file()}|thumb`
  let caption = this.data.caption
  if (caption) {
    text += `|${this.data.caption.wikitext()}`
  }
  return text + ']]'
}
module.exports = toWiki
