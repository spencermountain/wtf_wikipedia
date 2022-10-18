import smartReplace from './_lib/smartReplace.js'

const defaults = {
  links: true,
  formatting: true
}

//create links, bold, italic in markdown
function toMarkdown (options) {
  options = Object.assign({}, defaults, options)
  let md = this.text()
  //turn links back into links
  if (options.links === true) {
    this.links().forEach((link) => {
      let mdLink = link.markdown()
      let str = link.text() || link.page()
      md = smartReplace(md, str, mdLink)
    })
  }
  //turn bolds into **bold**
  if (options.formatting === true) {
    this.bolds().forEach((b) => {
      md = smartReplace(md, b, '**' + b + '**')
    })
    //support *italics*
    this.italics().forEach((i) => {
      md = smartReplace(md, i, '*' + i + '*')
    })
  }
  return md
}
export default toMarkdown
