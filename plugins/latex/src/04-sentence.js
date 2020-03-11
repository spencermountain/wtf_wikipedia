const smartReplace = require('./_lib/smartReplace')

const defaults = {
  links: true,
  formatting: true
}
// create links, bold, italic in latex
const toLatex = function(options) {
  options = Object.assign({}, defaults, options)
  let text = this.text()
  //turn links back into links
  if (options.links === true && this.links().length > 0) {
    this.links().forEach(link => {
      let tag = link.latex()
      let str = link.text() || link.page()
      text = smartReplace(text, str, tag)
    })
  }
  if (options.formatting === true) {
    if (this.data.fmt) {
      if (this.data.fmt.bold) {
        this.data.fmt.bold.forEach(str => {
          let tag = '\\textbf{' + str + '}'
          text = smartReplace(text, str, tag)
        })
      }
      if (this.data.fmt.italic) {
        this.data.fmt.italic.forEach(str => {
          let tag = '\\textit{' + str + '}'
          text = smartReplace(text, str, tag)
        })
      }
    }
  }
  return text
}
module.exports = toLatex
