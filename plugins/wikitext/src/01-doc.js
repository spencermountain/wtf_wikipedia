const defaults = {
  images: true,
  tables: true,
  infoboxes: true,
  categories: true,
  lists: true,
  links: true,
  paragraphs: true
}
const toWiki = function (options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''

  //if it's a redirect page
  if (this.isRedirect() === true) {
    return `#REDIRECT [[${this.redirectTo().page}]]`
  }

  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    text += this.infoboxes()
      .map((i) => i.wikitext(options))
      .join('\n')
  }

  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    let sections = this.sections()
    // sections = sections.filter((s) => s.title() !== 'References')
    text += sections.map((s) => s.wikitext(options)).join('\n')
  }

  // add categories on the bottom
  if (options.categories === true) {
    text += '\n'
    this.categories().forEach((cat) => (text += `\n[[Category: ${cat}]]`))
  }
  return text
}
module.exports = toWiki
