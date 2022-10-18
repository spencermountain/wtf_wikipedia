//turn a json table into a html table
function toHtml (options) {
  let rows = this.data
  let html = '<table class="table">\n'
  //make header
  html += '  <thead>\n'
  html += '  <tr>\n'

  Object.keys(rows[0]).forEach((k) => {
    if (/^col[0-9]/.test(k) !== true) {
      html += '    <td>' + k + '</td>\n'
    }
  })
  html += '  </tr>\n'
  html += '  </thead>\n'
  html += '  <tbody>\n'

  //make rows
  rows.forEach((o) => {
    html += '  <tr>\n'
    Object.keys(o).forEach((k) => {
      let val = o[k].html(options)
      html += '    <td>' + val + '</td>\n'
    })
    html += '  </tr>\n'
  })
  html += '  </tbody>\n'
  html += '</table>\n'
  return html
}
export default toHtml
