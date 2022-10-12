// add `[text](href)` to the text
function toMarkdown () {
  let href = this.href()
  href = href.replace(/ /g, '_')
  // href = encodeURIComponent(href)
  let str = this.text() || this.page()
  return '[' + str + '](' + href + ')'
}
export default toMarkdown
