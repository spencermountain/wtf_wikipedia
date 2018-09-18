
//
const toLatex = (list, options) => {
  let out = '\\begin{itemize}\n';
  list.forEach((o) => {
    out += '  \\item ' + o.text(options) + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};
module.exports = toLatex;
