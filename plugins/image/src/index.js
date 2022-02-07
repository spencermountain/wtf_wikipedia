const commonsURL = require('./url-hash')
const imgExists = require('./api/img-exists')
const mainImage = require('./mainImage')
const images = require('./api/images')
const license = require('./api/license')

const addMethod = function (models) {
  models.Doc.prototype.mainImage = mainImage
  // add a new method to Image class
  models.Image.prototype.commonsURL = commonsURL
  models.Image.prototype.exists = imgExists
  models.Image.prototype.license = license
  // redefine the "images" method
  const oldImages = models.Doc.prototype.images // store the old method to use in the new one
  models.Doc.prototype.images = images(oldImages)
}
module.exports = addMethod
