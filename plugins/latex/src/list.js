//
function toLatex (options) {
  let out = '\\begin{itemize}\n'
  this.lines().forEach((s) => {
    out += '  \\item ' + s.text(options) + '\n'
  })
  out += '\\end{itemize}\n'
  return out
}
export default toLatex
