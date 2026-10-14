const defaults = {
  sentences: true
}

const toHtml = function (options) {
  options = { ...defaults, ...options }
  let html = ''
  if (options.sentences === true) {
    html += this.sentences()
      .map((s) => s.html(options))
      .join('\n')
  }
  return html
}
export default toHtml
