//
const toHtml = function (Block, options) {
  let html = '  <ul class="list">\n'
  this.lines().forEach((s) => {
    html += '    <li>' + new Block(s.json('xl')).html(options) + '</li>\n'
  })
  html += '  </ul>\n'
  return html
}
export default toHtml
