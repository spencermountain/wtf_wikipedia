const defaults = {
  sentences: true,
}

function toLatex (options) {
  options = Object.assign({}, defaults, options)
  let out = ''
  if (options.sentences === true) {
    out += '\n\n% BEGIN Paragraph\n'
    out += this.sentences().reduce((str, s) => {
      str += s.latex(options) + '\n'
      return str
    }, '')
    out += '% END Paragraph'
  }
  return out
}
export default toLatex
