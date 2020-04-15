const birthDate = require('./birthDate')
const birthPlace = require('./birthPlace')
const isAlive = require('./isAlive')

const addMethod = function (models) {
  models.Doc.prototype.birthDate = birthDate
  models.Doc.prototype.birthPlace = birthPlace
  models.Doc.prototype.isAlive = isAlive
}
module.exports = addMethod
