const toWiki = function () {
  const { template, data } = this.json()
  let text = `{{${template || ''}`
  Object.keys(data).forEach((k) => {
    const val = data[k]
    if (val) {
      text += `| ${k} = ${val || ''}`
    }
  })
  text += '}}\n'
  return text
}
export default toWiki
