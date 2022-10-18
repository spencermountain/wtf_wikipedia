import encodeObj from '../_lib/encode.js'

/**
 * turn an infobox into some nice json
 *
 * @param {object} infobox
 * @param {object} [options]
 * @returns {object}
 */
function toJson (infobox, options) {
  let json = Object.keys(infobox._data).reduce((h, k) => {
    if (infobox._data[k]) {
      h[k] = infobox._data[k].json()
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
