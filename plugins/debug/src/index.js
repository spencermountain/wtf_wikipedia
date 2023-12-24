const plugin = function (models) {
  // look for unprocessed table wikitext
  models.Doc.prototype.hasBadTable = function () {
    let txt = this.text()
    if (/class="wikitable"/.test(txt)) {
      return true
    }
    if (/style="/.test(txt)) {
      return true
    }
    if (/width="/.test(txt)) {
      return true
    }
    if (/^! "/.test(txt)) {
      return true
    }
    if (/^|-"/.test(txt)) {
      return true
    }
    if (/colspan/.test(txt)) {
      return true
    }
    return false
  }
}

export default plugin
