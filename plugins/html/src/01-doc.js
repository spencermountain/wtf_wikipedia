const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const defaults = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true,
}
//we should try to make this look like the wikipedia does, i guess.
const softRedirect = function (doc) {
  const link = doc.redirectTo()
  let href = link.page
  href = './' + href.replace(/ /g, '_')
  if (link.anchor) {
    href += '#' + link.anchor
  }
  return `  <div class="redirect">
  ↳ <a class="link" href="${escape(href)}">${escape(link.text || link.page)}</a>
  </div>`
}

//turn a Doc object into a HTML string
const toHtml = function (options) {
  options = { ...defaults, ...options }
  let html = ''
  //add page title
  // only an explicit title, not one guessed from the first bolded text
  const title = this.options().title
  if (options.title === true && title) {
    html += '<title>' + escape(title) + '</title>\n'
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
    html += '\n<h2>References</h2>\n'
    html += this.references()
      .map((c) => c.html(options))
      .join('\n')
  }
  return html
}
export default toHtml
