const commonsURL = require('./url-hash')
const imgExists = require('./img-exists')

const addMethod = function(models) {
  // add a new method to Image class
  models.Image.commonsURL = commonsURL
  models.Image.exists = imgExists
}
module.exports = addMethod
