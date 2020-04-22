const defaults = {}

const doTemplate = function (obj) {
  let data = ''
  let name = obj.template
  Object.keys(obj).forEach((k) => {
    if (k !== 'template') {
      data += ` | ${k} = ${obj[k]}`
    }
  })
  return `{{${name}${data}}} `
}

const toWiki = function (options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''
  if (this.title()) {
    let side = '=='
    text += `\n${side} ${this.title()} ${side}\n`
  }
  // render some templates?
  this.templates().forEach((tmpl) => {
    text += doTemplate(tmpl) + '\n'
  })

  //make a table
  if (options.tables === true) {
    text += this.tables()
      .map((t) => t.wikitext(options))
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
      return p.wikitext(options)
    })
    .join('\n')

  // render references
  // these will be out of place
  this.references().forEach((ref) => {
    text += ref.wikitext(options) + '\n'
  })

  return text
}
module.exports = toWiki
