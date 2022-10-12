import smartReplace from './_lib/smartReplace.js'

const defaults = {
  links: true,
  formatting: true,
}
// create links, bold, italic in html
function doSentence (options) {
  options = Object.assign({}, defaults, options)
  let text = this.text()
  //turn links into <a href>
  if (options.links === true) {
    this.links().forEach((link) => {
      let str = link.text() || link.page()
      let tag = link.html()
      text = smartReplace(text, str, tag)
    })
  }
  if (options.formatting === true) {
    //support bolds
    this.bolds().forEach((str) => {
      let tag = '<b>' + str + '</b>'
      text = smartReplace(text, str, tag)
    })
    //do italics
    this.italics().forEach((str) => {
      let tag = '<i>' + str + '</i>'
      text = smartReplace(text, str, tag)
    })
  }
  return '<span class="sentence">' + text + '</span>'
}
export default doSentence
