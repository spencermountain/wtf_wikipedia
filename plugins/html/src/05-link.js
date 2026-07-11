const toHtml = function () {
  let classNames = 'link'
  let href = this.href() || ''
  href = href.replace(/ /g, '_')
  //use the url as the text, for bare external links like [https://foo.com]
  let str = this.text() || this.page() || this.site() || ''
  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  href = href.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return `<a class="${classNames}" href="${href}">${str}</a>`
}
export default toHtml
