const toWiki = function() {
  let text = `[[${this.file()}|thumb]]`
  return text
}
module.exports = toWiki
