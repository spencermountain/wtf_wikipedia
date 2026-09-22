//
const toMarkdown = function (options) {
  return this.lines()
    .map((s) => {
      const str = s.markdown(options)
      return ' * ' + str
    })
    .join('\n')
}
export default toMarkdown
