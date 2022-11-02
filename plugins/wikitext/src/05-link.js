// add `[text](href)` to the text
function toWiki () {
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
export default toWiki
