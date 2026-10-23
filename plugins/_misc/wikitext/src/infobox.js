const toWiki = function () {
  const { template, data } = this.json()
  let text = `{{${template}\n`
  Object.keys(data).forEach((k) => {
    const val = data[k]
    if (val) {
      text += `| ${k} = ${val.wiki || ''}\n`
    }
  })
  text += '}}\n'
  return text
}
export default toWiki
