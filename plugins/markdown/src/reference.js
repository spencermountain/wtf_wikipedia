//
const toMarkdown = function() {
  if (this.data && this.data.url && this.data.title) {
    return `⌃ [${this.data.title}](${this.data.url})`
  } else if (this.data.encyclopedia) {
    return `⌃ ${this.data.encyclopedia}`
  } else if (this.data.title) {
    //cite book, etc
    let str = this.data.title
    if (this.data.author) {
      str += this.data.author
    }
    if (this.data.first && this.data.last) {
      str += this.data.first + ' ' + this.data.last
    }
    return `⌃ ${str}`
  } else if (this.inline) {
    return `⌃ ${this.inline.markdown()}`
  }
  return ''
}
module.exports = toMarkdown
