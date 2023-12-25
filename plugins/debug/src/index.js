const plugin = function (models) {
  // look for unprocessed table wikitext
  models.Doc.prototype.hasBadTable = function () {
    let txt = this.text()
    if (/class="wikitable"/.test(txt)) {
      return 'wikitable'
    }
    if (/style="/.test(txt)) {
      return 'style'
    }
    if (/width="/.test(txt)) {
      return 'width'
    }
    if (/^! "/.test(txt)) {
      return '^!'
    }
    if (/^\|-"/.test(txt)) {
      return '|-'
    }
    if (/colspan/.test(txt)) {
      return 'colspan'
    }
    return false
  }

  models.Doc.prototype.hasNoText = function () {
    if (this.isDisambiguation() || this.isRedirect()) {
      return false
    }
    let txt = this.text()
    if (txt.length < 200) {
      return 'no-text'
    }
    return false
  }

  models.Doc.prototype.hasIPAPunct = function () {
    if (this.isDisambiguation() || this.isRedirect()) {
      return false
    }
    let str = this.sentences()[0].text()
    if (/[{|}]/.test(str)) {
      return 'has-punct'
    }
    if (/[ (],[ )(]/.test(str)) {
      return 'dangling-comma'
    }
    if (/ ;/.test(str)) {
      return 'dangling-semicolon'
    }
    if (/\(/.test(str) && !/\)/.test(str)) {
      return 'unclosed-paren'
    }
    if (!/\(/.test(str) && /\)/.test(str)) {
      return 'unopened-paren'
    }
    return false
  }

  models.Doc.prototype.isBad = function () {
    return this.hasBadTable() || this.hasNoText() || this.hasIPAPunct()
  }
}

export default plugin
