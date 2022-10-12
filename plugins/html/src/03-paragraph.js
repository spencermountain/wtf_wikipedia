const defaults = {
  sentences: true
}

function toHtml (options) {
  options = Object.assign({}, defaults, options)
  let html = ''
  if (options.sentences === true) {
    html += this.sentences()
      .map((s) => s.html(options))
      .join('\n')
  }
  return html
}
export default toHtml
