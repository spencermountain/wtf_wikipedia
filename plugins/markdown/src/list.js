//
const toMarkdown = function(options) {
  return this.lines()
    .map(s => {
      let str = s.markdown(options)
      return ' * ' + str
    })
    .join('\n')
}
module.exports = toMarkdown
