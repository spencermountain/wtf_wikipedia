const toWiki = function () {
  const data = this.json()
  let text = `{{${this.type || ''}`
  Object.keys(data).forEach((k) => {
    if (k === 'template') {
      return
    }
    const val = data[k]
    if (val) {
      text += `| ${k} = ${val || ''}`
    }
  })
  text += '}}\n'
  return text
}
export default toWiki
