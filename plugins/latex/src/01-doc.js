const defaults = {
  infoboxes: true,
  sections: true,
}

// we should try to make this look like the wikipedia does, i guess.
function softRedirect (doc) {
  let link = doc.redirectTo()
  let href = link.page
  href = './' + href.replace(/ /g, '_')
  //add anchor
  if (link.anchor) {
    href += '#' + link.anchor
  }
  return '↳ \\href{' + href + '}{' + link.text + '}'
}

//
function toLatex (options) {
  options = Object.assign({}, defaults, options)
  let out = ''
  //if it's a redirect page, give it a 'soft landing':
  if (this.isRedirect() === true) {
    return softRedirect(this) //end it here.
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    out += this.infoboxes()
      .map((i) => i.latex(options))
      .join('\n')
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    out += this.sections()
      .map((s) => s.latex(options))
      .join('\n')
  }
  //default off
  //render citations
  if (options.references === true) {
    out += this.references()
      .map((c) => c.latex(options))
      .join('\n')
  }
  return out
}
export default toLatex
