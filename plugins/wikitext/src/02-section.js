const defaults = {}

const generic = function (tmpl) {
  let list = tmpl.list || []
  list = list.join('|')
  return `{{${tmpl.template}|${list}}}\n`
}

const doTemplates = {
  main: generic
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
    if (doTemplates.hasOwnProperty(tmpl.template)) {
      text += doTemplates[tmpl.template](tmpl)
    }
  })

  //put any images under the header
  if (options.images === true) {
    let imgs = this.images()
    if (imgs.length > 0) {
      text += imgs.map((image) => image.wikitext(options)).join('\n')
    }
  }

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
  return text
}
module.exports = toWiki
