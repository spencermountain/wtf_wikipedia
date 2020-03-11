//
const toHtml = function(options) {
  if (this.data && this.data.url && this.data.title) {
    let str = this.data.title
    if (options.links === true) {
      str = `<a href="${this.data.url}">${str}</a>`
    }
    return `<div class="reference">⌃ ${str} </div>`
  }
  if (this.data.encyclopedia) {
    return `<div class="reference">⌃ ${this.data.encyclopedia}</div>`
  }
  if (this.data.title) {
    //cite book, etc
    let str = this.data.title
    if (this.data.author) {
      str += this.data.author
    }
    if (this.data.first && this.data.last) {
      str += this.data.first + ' ' + this.data.last
    }
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (this.inline) {
    return `<div class="reference">⌃ ${this.inline.html()}</div>`
  }
  return ''
}
module.exports = toHtml
