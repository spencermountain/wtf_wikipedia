//
const toHtml = function (options) {
  const data = this.json().data
  if (data && data.url && data.title) {
    let str = data.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const url = data.url.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    if (options.links === true) {
      str = `<a href="${url}">${str}</a>`
    }
    return `<div class="reference">⌃ ${str} </div>`
  }
  if (data.encyclopedia) {
    const str = data.encyclopedia.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.title) {
    //cite book, etc
    let str = data.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    if (data.author) {
      str += data.author.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    if (data.first && data.last) {
      str += data.first.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + ' ' + data.last.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.inline) {
    return `<div class="reference">⌃ ${data.inline.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
  }
  return ''
}
export default toHtml
