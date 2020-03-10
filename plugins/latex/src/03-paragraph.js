const defaults = {
  sentences: true
}

const toLatex = function(options) {
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
module.exports = toLatex
