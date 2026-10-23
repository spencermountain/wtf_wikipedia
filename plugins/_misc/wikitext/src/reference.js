import template from './template.js'

const toWiki = function () {
  const { data } = this.json()
  if (data.inline) {
    return `<ref>${data.inline.wiki}</ref>`
  }
  return `<ref>${template.call(this).trim()}</ref>`
}
export default toWiki
