function toWiki () {
  let text = `{{Infobox ${this._type || ''}\n`
  Object.keys(this._data).forEach((k) => {
    let val = this._data[k]
    if (val) {
      text += `| ${k} = ${val.wikitext() || ''}\n`
    }
  })
  text += '}}\n'
  return text
}
export default toWiki
