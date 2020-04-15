const birthDate = require('./birthDate')
const birthPlace = require('./birthPlace')
const isAlive = require('./isAlive')
const deathDate = require('./deathDate')
const deathPlace = require('./deathPlace')
const nationality = require('./nationality')

const addMethod = function (models) {
  models.Doc.prototype.birthDate = function () {
    return birthDate(this)
  }
  models.Doc.prototype.birthPlace = function () {
    return birthPlace(this)
  }
  models.Doc.prototype.isAlive = function () {
    return isAlive(this)
  }
  models.Doc.prototype.deathDate = function () {
    return deathDate(this)
  }
  models.Doc.prototype.deathPlace = function () {
    return deathPlace(this)
  }
  models.Doc.prototype.nationality = function () {
    return nationality(this)
  }
}
module.exports = addMethod
