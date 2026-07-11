// add `[text](href)` to the text
const toMarkdown = function () {
  let href = this.href() || ''
  href = href.replace(/ /g, '_')
  // href = encodeURIComponent(href)
  //use the url as the text, for bare external links like [https://foo.com]
  let str = this.text() || this.page() || this.site() || ''
  return '[' + str + '](' + href + ')'
}
export default toMarkdown
