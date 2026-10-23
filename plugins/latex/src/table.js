//create a formal LATEX table
const doTable = function (Sentence, options) {
  const rows = this.json().rows
  if (rows.length === 0) {
    return ''
  }
  let out = '\n%\\vspace*{0.3cm}\n'
  out +=
    '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns'
  out +=
    "\n% Format Align Column: 'l'=left 'r'=right align, 'c'=center, 'p{5cm}'=block with column width 5cm "
  out += '\n\\begin{tabular}{|'
  Object.keys(rows[0]).forEach(() => {
    out += 'l|'
  })
  out += '} \n'
  out += '\n  \\hline  %horizontal line\n'
  //make header
  out += '\n  % BEGIN: Table Header'
  let vSep = '   '
  const headers = this.headers()
  Object.keys(rows[0]).forEach((_key, i) => {
    out += '\n    ' + vSep

    if (headers[i]) {
      out += '\\textbf{' + new Sentence(headers[i].json('xl')).latex(options) + '}'
    } else {
      out += '  '
    }
    vSep = ' & '
  })
  out += '\\\\ '
  out += '\n  % END: Table Header'
  out += '\n  % BEGIN: Table Body'
  out += '\n  \\hline  % ----- table row -----'
  ////make rows
  rows.forEach((o) => {
    vSep = ' '
    out += '\n  % ----- table row -----'
    Object.keys(o).forEach((k) => {
      const s = new Sentence(o[k])
      const val = s.latex(options)
      out += '\n    ' + vSep + val + ''
      vSep = ' & '
    })
    out += '  \\\\ ' // newline in latex table = two backslash \\
    out += '\n  \\hline  %horizontal line'
  })
  out += '\n    % END: Table Body'
  out += '\\end{tabular} \n'
  out += '\n\\vspace*{0.3cm}\n\n'
  return out
}
export default doTable
