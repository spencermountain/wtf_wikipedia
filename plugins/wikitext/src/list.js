const toWiki = function() {
  return this.lines().map(str => {
    return `* ${str}`
  })
}
module.exports = toWiki
