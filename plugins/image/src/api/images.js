const fetch = require('./fetch')

/**
 * The old "images" method
 * @callback oldMethod
 * @param {number} [clue]
 * @returns {Object[]} an array of images or a single image
 */

/**
 * Redefines the "images" method. When the user wants to call certain methods (that make requests)
 * for all the images; it calls the api once for all the images, then redefines those methods which
 * now only return the already fetched response.
 * 
 * @param {oldMethod} oldMethod
 * @returns {newMethod}
 */

const images = function (oldMethod) {

  /**
   * @typedef imagesOptions
   * @property {string | string[]} batch specifies the methods to be rquested beforehand in one API call
   */

  /**
   * The new "images" method.
   * 
   * @function newMethod
   * @param {number | imagesOptions} [clue]
   * @returns {Promise<Object[]> | Object[]} an array of images or a single image
   */

  const newMethod = function (clue) { // "this" refers to the document
    
    // adds userAgent to each image, to use for methods that call the API.
    const addUserAgent = function (imgs) {
      return imgs.map( i => {
        i.data['_userAgent'] = this['_userAgent']
        return i
      })
    }
    let imagesArr

    // return a single image (oldMethod accepts a number clue)
    if (typeof clue === "number") {
      imagesArr = oldMethod.call(this, clue)
      imagesArr = addUserAgent.call(this, imagesArr)
      return imagesArr
    }
    // return images based on the new clue value (options object)
    else if (typeof clue === "object") {
      if (clue.batch) {
        imagesArr = oldMethod.call(this)
        imagesArr = addUserAgent.call(this, imagesArr)
        return fetch.call(this, clue.batch, imagesArr).then(methodsRes => {
          let methodsRedefined = false
          imagesArr = imagesArr.map((image, ind) => {
            
            // add the results to plugin data
            image.data.pluginData = {
              ...image.data.pluginData,
              ...methodsRes[ind]
            }

            // redefine methods on the image prototype just once
            if (!methodsRedefined) {
              if (Object.keys(methodsRes[ind]).length > 0) {
                methodsRedefined = true
                const imageProto = Object.getPrototypeOf(image)
                Object.keys(image.data.pluginData).forEach(k => {
                  const methodName = k.slice(0,-3) // each key is like "<methodName>Res"
                  imageProto[methodName] = function () {
                    // return a Promise for consistency
                    return Promise.resolve(this.data.pluginData[k] || null)
                  }
                })
              }
            }
            return image
          })
          return imagesArr
        })
      }
    }
    imagesArr = oldMethod.call(this)
    imagesArr = addUserAgent.call(this, imagesArr)
    return imagesArr
  }
  return newMethod
}
module.exports = images
