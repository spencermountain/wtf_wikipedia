//
const toMarkdown = function (Sentence, options) {
  return this.lines()
    .map((s) => {
      const str = new Sentence(s).markdown(options)
      return ' * ' + str
    })
    .join('\n')
}
export default toMarkdown
