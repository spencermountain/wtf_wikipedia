const toHtml = function() {
  let classNames = 'link'
  let href = this.href()
  let str = this.text() || this.page()
  return `<a class="${classNames}" href="${href}">${str}</a>`
}
module.exports = toHtml
