const doSentence = require('./sentence');

const dontDo = {
  image: true,
  caption: true
};
//
const infobox = function(obj, options) {
  let out  = '\n \\vspace*{0.3cm} % Info Box\n\n';
  out  += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out  += '  \\hline  %horizontal line\n';

  Object.keys(obj.data).forEach((k) => {
    if (dontDo[k] === true) {
      return;
    }
    let val = doSentence(obj.data[k], options);
    out  += '  % ---------- \n';
    out  += '      ' + k + ' & \n';
    out  += '      ' + val + '\\\\ \n';
    out  += '  \\hline  %horizontal line\n';
  });
  out  += '\\end{tabular} \n';
  out  += '\n\\vspace*{0.3cm}\n\n';
  return out ;
};
module.exports = infobox;
