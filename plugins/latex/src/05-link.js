const toLatex = function() {
  let href = this.href()
  href = href.replace(/ /g, '_')
  let str = this.text() || this.page()
  return '\\href{' + href + '}{' + str + '}'
}
module.exports = toLatex
