import smartReplace from './_lib/smartReplace.js'

const defaults = {
  links: true,
  formatting: true,
}
// create links, bold, italic in latex
const toLatex = function (options) {
  options = { ...defaults, ...options }
  let text = this.text()
  //turn links back into links
  if (options.links === true && this.links().length > 0) {
    this.links().forEach((link) => {
      const tag = link.latex()
      const str = link.text() || link.page()
      text = smartReplace(text, str, tag)
    })
  }
  if (options.formatting === true) {
    if (this.bolds()) {
      this.bolds().forEach(({ text: str }) => {
        const tag = '\\textbf{' + str + '}'
        text = smartReplace(text, str, tag)
      })
    }
    if (this.italics()) {
      this.italics().forEach(({ text: str }) => {
        const tag = '\\textit{' + str + '}'
        text = smartReplace(text, str, tag)
      })
    }
  }
  return text
}
export default toLatex
