import birthDate from './birthDate/index.js'
import birthPlace from './birthPlace/index.js'
import isAlive from './isAlive/index.js'
import deathDate from './deathDate/index.js'
import deathPlace from './deathPlace/index.js'
import nationality from './nationality/index.js'

function addMethod (models) {
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
export default addMethod
