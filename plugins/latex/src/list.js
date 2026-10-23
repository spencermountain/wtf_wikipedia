//
const toLatex = function (Sentence, options) {
  let out = '\\begin{itemize}\n'
  this.lines().forEach((s) => {
    out += '  \\item ' + new Sentence(s).latex(options) + '\n'
  })
  out += '\\end{itemize}\n'
  return out
}
export default toLatex
