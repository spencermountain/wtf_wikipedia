//
const toHtml = function (options) {
  if (this.data && this.data.url && this.data.title) {
    let str = this.data.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    let url = this.data.url.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    if (options.links === true) {
      str = `<a href="${url}">${str}</a>`
    }
    return `<div class="reference">⌃ ${str} </div>`
  }
  if (this.data.encyclopedia) {
    let str = this.data.encyclopedia.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (this.data.title) {
    //cite book, etc
    let str = this.data.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    if (this.data.author) {
      str += this.data.author.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    if (this.data.first && this.data.last) {
      str += this.data.first.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + ' ' + this.data.last.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (this.inline) {
    return `<div class="reference">⌃ ${this.inline.html()}</div>`
  }
  return ''
}
export default toHtml
