const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  signature_alt: true
}

const defaults = {
  images: true
}

//
const infobox = function (Sentence, options) {
  options = { ...defaults, ...options }
  const data = this.json().data
  let out = '\n \\vspace*{0.3cm} % Info Box\n\n'
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n'
  out += '  \\hline  %horizontal line\n'
  //todo: render top image here
  Object.keys(data).forEach((k) => {
    if (dontDo[k] === true) {
      return
    }
    const blocks = [].concat(data[k])
    const val = blocks.map((block) => new Sentence(block).latex(options)).join(' ')
    out += '  % ---------- \n'
    out += '      ' + k + ' & \n'
    out += '      ' + val + '\\\\ \n'
    out += '  \\hline  %horizontal line\n'
  })
  out += '\\end{tabular} \n'
  out += '\n\\vspace*{0.3cm}\n\n'
  return out
}
export default infobox
