//not so impressive right now
const toLatex = function () {
  const str = this.json().data.title || ''
  return '⌃ ' + str + '\n'
}
export default toLatex
