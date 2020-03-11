// add `[text](href)` to the text
const toWiki = function() {
  //if it's an external link, we good
  if (this.site()) {
    if (this.text()) {
      return `[${this.site()}|${this.text()}]`
    }
    return `[${this.site()}]`
  }
  let page = this.page() || ''
  if (this.anchor()) {
    page += `#${this.anchor()}`
  }

  let str = this.text() || ''
  if (str && str.toLowerCase() !== page.toLowerCase()) {
    return `[[${page}|${str}]]`
  }
  return `[[${page}]]`
}
module.exports = toWiki
