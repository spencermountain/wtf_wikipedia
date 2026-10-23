//
const toMarkdown = function () {
  const data = this.json().data
  if (data && data.url && data.title) {
    return `⌃ [${data.title}](${data.url})`
  } else if (data.encyclopedia) {
    return `⌃ ${data.encyclopedia}`
  } else if (data.title) {
    //cite book, etc
    let str = data.title
    if (data.author) {
      str += data.author
    }
    if (data.first && data.last) {
      str += data.first + ' ' + data.last
    }
    return `⌃ ${str}`
  } else if (data.inline) {
    return `⌃ ${data.inline.text}`
  }
  return ''
}
export default toMarkdown
