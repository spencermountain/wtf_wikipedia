const toWiki = function () {
  let text = `{{${this.data.template || ''}`
  Object.keys(this.data).forEach((k) => {
    if (k === 'template') {
      return
    }
    const val = this.data[k]
    if (val) {
      text += `| ${k} = ${val || ''}`
    }
  })
  text += '}}\n'
  return text
}
export default toWiki
