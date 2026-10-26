//turn a json table into a html table
const toHtml = function (Block, options) {
  const rows = this.json().rows
  if (rows.length === 0) {
    return ''
  }
  let html = '<table class="table">\n'
  //make header
  html += '  <thead>\n'
  html += '  <tr>\n'

  this.headers().forEach((header) => {
    html += '    <td>' + header.text() + '</td>\n'
  })
  html += '  </tr>\n'
  html += '  </thead>\n'
  html += '  <tbody>\n'

  //make rows
  rows.forEach((o) => {
    html += '  <tr>\n'
    Object.keys(o).forEach((k) => {
      const val = new Block(o[k]).html(options)
      html += '    <td>' + val + '</td>\n'
    })
    html += '  </tr>\n'
  })
  html += '  </tbody>\n'
  html += '</table>\n'
  return html
}
export default toHtml
