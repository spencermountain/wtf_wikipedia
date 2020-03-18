//
const toLatex = function() {
  let alt = this.alt()
  let out = '\\begin{figure}'
  out += '\n\\includegraphics[width=\\linewidth]{' + this.thumb() + '}'
  out += '\n\\caption{' + alt + '}'
  // out += '\n%\\label{fig:myimage1}';
  out += '\n\\end{figure}'
  return out
}
module.exports = toLatex
