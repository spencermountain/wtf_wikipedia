const toWiki = function () {
  if (this.data.inline) {
    return `<ref>${this.data.inline.wikitext()}</ref>`
  }
  let type = this.data.type || 'cite web'
  let data = ''
  Object.keys(this.data).forEach((k) => {
    if (k !== 'template' && k !== 'type') {
      data += ` | ${k} = ${this.data[k]}`
    }
  })
  return `<ref>{{${type}${data}}}</ref>`
}
module.exports = toWiki
