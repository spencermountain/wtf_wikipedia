
const doTable = function(table, options) {
  let out = '\n%\\vspace*{0.3cm}\n';
  out += '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
  out += '\n% Format Align Column: \'l\'=left \'r\'=right align, \'c\'=center, \'p{5cm}\'=block with column width 5cm ';
  out += '\n\\begin{tabular}{|';
  Object.keys(table[0]).forEach(() => {
    out += 'l|';
  });
  out += '} \n';
  out += '\n  \\hline  %horizontal line\n';
  //make header
  out += '\n  % BEGIN: Table Header';
  var vSep = '   ';
  Object.keys(table[0]).forEach((k) => {
    out += '\n    ' + vSep;

    if (k.indexOf('col-') === 0) {
      out += '\\textbf{' + k + '}';
    } else {
      out += '  ';
    }
    vSep = ' & ';
  });
  out += '\\\\ ';
  out += '\n  % END: Table Header';
  out += '\n  % BEGIN: Table Body';
  out += '\n  \\hline  % ----- table row -----';
  ////make rows
  table.forEach((o) => {
    vSep = ' ';
    out += '\n  % ----- table row -----';
    Object.keys(o).forEach((k) => {
      let s = o[k];
      let val = s.latex(options);
      out += '\n    ' + vSep + val + '';
      vSep = ' & ';
    });
    out += '  \\\\ '; // newline in latex table = two backslash \\
    out += '\n  \\hline  %horizontal line';
  });
  out += '\n    % END: Table Body';
  out += '\\end{tabular} \n';
  out += '\n\\vspace*{0.3cm}\n\n';
  return out;
};
module.exports = doTable;
