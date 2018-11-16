
//
const toLatex = (list, options) => {
  let out = '\\begin{itemize}\n';
  list.lines().forEach((s) => {
    out += '  \\item ' + s.text(options) + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};
module.exports = toLatex;
