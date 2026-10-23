//
const toHtml = function (Sentence, options) {
  let html = '  <ul class="list">\n'
  this.lines().forEach((s) => {
    html += '    <li>' + new Sentence(s).html(options) + '</li>\n'
  })
  html += '  </ul>\n'
  return html
}
export default toHtml
