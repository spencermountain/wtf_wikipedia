const toWiki = function () {
  let txt = ''
  this.lines().forEach((s) => {
    txt += `* ${s.wikitext()}\n`
  })
  return txt
}
export default toWiki
