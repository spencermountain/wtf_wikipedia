//
const toHtml = function(options) {
  let html = '  <ul class="list">\n'
  this.lines().forEach(s => {
    html += '    <li>' + s.html(options) + '</li>\n'
  })
  html += '  </ul>\n'
  return html
}
module.exports = toHtml
