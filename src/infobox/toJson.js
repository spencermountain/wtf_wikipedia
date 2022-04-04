import encodeObj from '../_lib/encode.js'

/**
 * turn an infobox into some nice json
 * 
 * @param {object} infobox 
 * @param {object} [options] 
 * @returns {object}
 */
const toJson = function (infobox, options) {
  let json = Object.keys(infobox.data).reduce((h, k) => {
    if (infobox.data[k]) {
      h[k] = infobox.data[k].json()
    }
    return h
  }, {})

  //support mongo-encoding keys
  if (options.encode === true) {
    json = encodeObj(json)
  }
  return json
}
export default toJson
