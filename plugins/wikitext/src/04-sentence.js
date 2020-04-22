const smartReplace = require('./_lib/smartReplace')

const defaults = {
  links: true
}

const toWiki = function (options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = this.text()
  if (options.links === true) {
    this.links().forEach((link) => {
      let str = link.text() || link.page()
      let tag = link.wikitext()
      text = smartReplace(text, str, tag)
    })
  }
  if (options.formatting === true) {
    //support bolds
    this.bold().forEach((str) => {
      let tag = '**' + str + '**'
      text = smartReplace(text, str, tag)
    })
    //do italics
    this.italic().forEach((str) => {
      let tag = '***' + str + '***'
      text = smartReplace(text, str, tag)
    })
  }

  return text
}
module.exports = toWiki
