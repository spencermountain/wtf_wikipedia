const commonsURL = require('./url-hash')
const imgExists = require('./img-exists')
const mainImage = require('./mainImage')

const addMethod = function (models) {
  models.Doc.mainImage = mainImage
  // add a new method to Image class
  models.Image.prototype.commonsURL = commonsURL
  models.Image.prototype.exists = imgExists
}
module.exports = addMethod
