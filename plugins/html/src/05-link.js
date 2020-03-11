const helpers = require('./_lib/helpers')

const toHtml = function() {
  let href = ''
  let classNames = 'link'
  if (this.site()) {
    //use an external link
    href = this.site()
    classNames += ' external'
  } else {
    //otherwise, make it a relative internal link
    href = helpers.capitalise(this.page())
    href = './' + href.replace(/ /g, '_')
    //add anchor
    if (this.anchor()) {
      href += `#${this.anchor()}`
    }
  }
  let str = this.text() || this.page()
  return `<a class="${classNames}" href="${href}">${str}</a>`
}
module.exports = toHtml
