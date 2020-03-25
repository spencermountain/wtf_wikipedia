const toHtml = function() {
  let classNames = 'link'
  let href = this.href()
  href = href.replace(/ /g, '_')
  let str = this.text() || this.page()
  return `<a class="${classNames}" href="${href}">${str}</a>`
}
module.exports = toHtml
