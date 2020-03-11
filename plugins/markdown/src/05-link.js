const helpers = require('./_lib/helpers')

// add `[text](href)` to the text
const toMarkdown = function() {
  let href = ''
  //if it's an external link, we good
  if (this.site()) {
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
  return '[' + str + '](' + href + ')'
}
module.exports = toMarkdown
