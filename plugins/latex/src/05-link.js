const helpers = require('./_lib/helpers')

const toLatex = function() {
  let href = ''
  if (this.site()) {
    //use an external link
    href = this.site()
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
  return '\\href{' + href + '}{' + str + '}'
}
module.exports = toLatex
