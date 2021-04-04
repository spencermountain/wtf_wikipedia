const toWiki = function () {
  let text = `{{${this.data.template || ''}`
  Object.keys(this.data).forEach((k) => {
    if (k === 'template') {
      return
    }
    let val = this.data[k]
    if (val) {
      text += `| ${k} = ${val || ''}`
    }
  })
  text += '}}\n'
  return text
}
module.exports = toWiki
