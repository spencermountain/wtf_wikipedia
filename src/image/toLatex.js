//
const toLatex = function(image) {
  let alt = image.alt();
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + image.thumb() + '}';
  out += '\n\\caption{' + alt + '}';
  // out += '\n%\\label{fig:myimage1}';
  out += '\n\\end{figure}';
  return out;
};
module.exports = toLatex;
