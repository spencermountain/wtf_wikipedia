// const birthDate = require('./birthDate')

const addMethod = function (models) {
  models.Doc.prototype.disambiguation = function () {
    if (this.isDisambiguation() !== true) {
      return null
    }
    return {}
  }
  // alias
  models.Doc.prototype.disambig = models.Doc.prototype.disambiguation
}
module.exports = addMethod
