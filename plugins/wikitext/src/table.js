const toWiki = function (options) {
  let rows = this.data
  let wiki = `{| class="wikitable"\n`

  // draw headers
  let headers = Object.keys(rows[0])
  headers = headers.filter((k) => /^col[0-9]/.test(k) !== true)
  if (headers.length > 0) {
    wiki += '|-\n'
    headers.forEach((k) => {
      wiki += '! ' + k + '\n'
    })
  }
  //make rows
  rows.forEach((o) => {
    wiki += '|-\n'
    Object.keys(o).forEach((k) => {
      let val = o[k].wikitext(options)
      wiki += '| ' + val + '\n'
    })
  })
  wiki += `|}`
  return wiki
}
module.exports = toWiki
