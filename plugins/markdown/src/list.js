//
function toMarkdown (options) {
  return this.lines()
    .map((s) => {
      let str = s.markdown(options)
      return ' * ' + str
    })
    .join('\n')
}
export default toMarkdown
