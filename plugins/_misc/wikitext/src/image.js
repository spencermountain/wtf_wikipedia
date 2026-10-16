const toWiki = function () {
  let text = `[[${this.file()}|thumb`
  const caption = this.data.caption
  if (caption) {
    text += `|${this.data.caption.wikitext()}`
  }
  return text + ']]'
}
export default toWiki
