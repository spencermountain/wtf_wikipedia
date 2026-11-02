import version from './_version.js'
import birthDate from './birthDate/index.js'
import birthPlace from './birthPlace/index.js'
import isAlive from './isAlive/index.js'
import deathDate from './deathDate/index.js'
import deathPlace from './deathPlace/index.js'
import nationality from './nationality/index.js'
import names from './names/index.js'
import occupation from './occupation/index.js'
import spouses from './spouses/index.js'
import children from './children/index.js'
import age from './age/index.js'

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
  models.Doc.prototype.names = function () {
    return names(this)
  }
  models.Doc.prototype.occupation = function () {
    return occupation(this)
  }
  models.Doc.prototype.spouses = function () {
    return spouses(this)
  }
  models.Doc.prototype.children = function () {
    return children(this)
  }
  models.Doc.prototype.age = function () {
    return age(this)
  }
}
addMethod.version = version

export default addMethod
