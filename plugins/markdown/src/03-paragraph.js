const defaults = {
  sentences: true
}

const toMarkdown = function (options) {
  options = { ...defaults, ...options }
  let md = ''
  if (options.sentences === true) {
    md += this.sentences().reduce((str, s) => {
      str += s.markdown(options) + '\n'
      return str
    }, {})
  }
  return md
}
export default toMarkdown
