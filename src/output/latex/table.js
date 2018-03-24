const doSentence = require('./sentence');


const doTable = function(table, options) {
  let out  = '\n\\vspace*{0.3cm}\n\n';
  out  += '% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns'
  out  += "% Format Align Column: 'l'=left 'r'=right align, 'c'=center, 'p{5cm}'=block with column width 5cm ";
  out  += '\\begin{tabular}{|'
  Object.keys(table[0]).forEach((k) => {
    out  += 'l|';
  });
  '} \n';
  out  += '  \\hline  %horizontal line\n';
//make header
  out  += '  % BEGIN: Table Header';
  var vSep = " ";
  Object.keys(table[0]).forEach((k) => {
    out  += '    ' + vSep + +"\\textbf{" + k + +"} "+ '\n';
    vSep = " & ";
  });
  out  += '\\\\ \n'
  out  += '  % END: Table Header\n';
  out  += '  % BEGIN: Table Body';
  out  += '  \\hline  % ----- table row -----\n';
////make rows
  table.forEach((o) => {
    vSep = " ";
    out  += '  % ----- table row -----\n';
    Object.keys(o).forEach((k) => {
      let val = doSentence(o[k], options);
      out  += '    ' + vSep + val + '\n';
      vSep = " & ";
    });
    out  += '  \\\\ \n'; // newline in latex table = two backslash \\
    out  += '  \\hline  %horizontal line\n';
  });
  out  += '    % END: Table Body\n';
  out  += '} % END TABLE\n';
  out  += '\n\\vspace*{0.3cm}\n\n';
  return out ;
};
module.exports = doTable;
