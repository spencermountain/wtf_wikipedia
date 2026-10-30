const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const toHtml = function (options = {}) {
  const data = this.json().data || {}
  if (data && data.url && data.title) {
    let str = escape(data.title)
    const url = escape(data.url)
    if (options.links === true) {
      str = `<a href="${url}">${str}</a>`
    }
    return `<div class="reference">⌃ ${str} </div>`
  }
  if (data.encyclopedia) {
    const str = escape(data.encyclopedia)
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.title) {
    //cite book, etc
    let str = escape(data.title)
    if (data.author) {
      str += ' ' + escape(data.author)
    }
    if (data.first && data.last) {
      str += ' ' + escape(data.first) + ' ' + escape(data.last)
    }
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.inline) {
    return `<div class="reference">⌃ ${escape(data.inline.text)}</div>`
  }
  return ''
}
export default toHtml
