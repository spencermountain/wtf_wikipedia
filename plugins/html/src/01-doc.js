const defaults = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true
}
//we should try to make this look like the wikipedia does, i guess.
function softRedirect (doc) {
  let link = doc.redirectTo()
  let href = link.page
  href = './' + href.replace(/ /g, '_')
  if (link.anchor) {
    href += '#' + link.anchor
  }
  return `  <div class="redirect">
  ↳ <a class="link" href="./${href}">${link.text}</a>
  </div>`
}

//turn a Doc object into a HTML string
function toHtml (options) {
  options = Object.assign({}, defaults, options)
  let html = ''
  //add page title
  if (options.title === true && this._title) {
    html += '<title>' + this._title + '</title>\n'
  }
  //if it's a redirect page, give it a 'soft landing':
  if (this.isRedirect() === true) {
    html += softRedirect(this)
    return html
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    html += this.infoboxes()
      .map((i) => i.html(options))
      .join('\n')
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    html += this.sections()
      .map((s) => s.html(options))
      .join('\n')
  }
  //default off
  if (options.references === true) {
    html += '<h2>References</h2>'
    html += this.references()
      .map((c) => c.html(options))
      .join('\n')
  }
  return html
}
export default toHtml
