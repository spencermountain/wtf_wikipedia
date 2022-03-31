import commonsURL from './url-hash.js'
import imgExists from './api/img-exists.js'
import mainImage from './mainImage.js'
import images from './api/images.js'
import license from './api/license.js'

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
export default addMethod
