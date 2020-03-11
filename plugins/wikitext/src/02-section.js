const defaults = {}

const generic = function(tmpl) {
  let list = tmpl.list || []
  list = list.join('|')
  return `{{${tmpl.template}|${list}}}\n`
}

const doTemplates = {
  main: generic
}

const toWiki = function(options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let text = ''
  if (this.title()) {
    let side = '=='
    text += `\n${side} ${this.title()} ${side}\n`
  }
  // render some templates?
  this.templates().forEach(tmpl => {
    if (doTemplates.hasOwnProperty(tmpl.template)) {
      text += doTemplates[tmpl.template](tmpl)
    }
  })

  text += this.paragraphs()
    .map(p => {
      return p.wikitext(options)
    })
    .join('\n')
  return text
}
module.exports = toWiki
