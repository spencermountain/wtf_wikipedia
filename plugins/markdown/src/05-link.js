// add `[text](href)` to the text
const toMarkdown = function() {
  let href = this.href()
  href = href.replace(/ /g, '_')
  // href = encodeURIComponent(href)
  let str = this.text() || this.page()
  return '[' + str + '](' + href + ')'
}
module.exports = toMarkdown
