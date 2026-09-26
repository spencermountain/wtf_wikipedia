const defaults = {}

const doTemplate = function (obj) {
  let data = ''
  const name = obj.template
  Object.keys(obj).forEach((k) => {
    if (k !== 'template') {
      data += ` | ${k} = ${obj[k]}`
    }
  })
  return `{{${name}${data}}} `
}

const toWiki = function (options) {
  options ||= {}
  options = { ...defaults, ...options }
  let text = ''
  if (this.title()) {
    const side = '=='
    text += `\n${side} ${this.title()} ${side}\n`
  }
  // render some templates?
  if (options.templates === true) {
    this.templates().forEach((tmpl) => {
      text += doTemplate(tmpl.json()) + '\n'
    })
  }

  //make a table
  if (options.tables === true) {
    text += this.tables()
      .map((t) => t.makeWikitext(options))
      .join('\n')
  }

  // make a html bullet-list
  if (options.lists === true) {
    text += this.lists()
      .map((list) => list.text(options))
      .join('\n')
  }
  text += this.paragraphs()
    .map((p) => {
      return p.makeWikitext(options)
    })
    .join('\n')

  // render references
  // these will be out of place
  this.references().forEach((ref) => {
    text += ref.makeWikitext(options) + '\n'
  })

  return text
}
export default toWiki
