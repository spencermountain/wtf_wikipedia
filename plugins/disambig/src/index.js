// const birthDate = require('./birthDate')

const addMethod = function (models) {
  models.Doc.prototype.disambiguation = function () {
    // remove 'see also'
    let s = this.section('see also')
    if (s !== null) {
      s.remove()
    }
    // console.log(s)
    console.log(this.sections().map((s) => s.title()))
    if (this.isDisambiguation() !== true) {
      return null
    }
    return {}
  }
  // alias
  models.Doc.prototype.disambig = models.Doc.prototype.disambiguation
}
module.exports = addMethod
