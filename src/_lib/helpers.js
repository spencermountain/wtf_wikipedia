/**
 * capitalizes the input
 * hello -> Hello
 * hello there -> Hello there
 *
 * @private
 * @param {string} [str] the string that will be capitalized
 * @returns {string} the capitalized string
 */
function capitalise(str) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return ''
}

/**
 * trim whitespaces of the ends normalize 2 spaces into one and removes whitespaces before commas
 *
 * @private
 * @param {string} [str] the string that will be processed
 * @returns {string} the processed string
 */
function trim_whitespace(str) {
  if (str && typeof str === 'string') {
    str = str.replace(/^\s+/, '')
    str = str.replace(/\s+$/, '')
    str = str.replace(/ {2}/, ' ')
    str = str.replace(/\s, /, ', ')
    return str
  }
  return ''
}

/**
 * determines if an variable is an array or not
 *
 * @private
 * @param {*} x the variable that needs to be checked
 * @returns {boolean} whether the variable is an array
 */
function isArray(x) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

/**
 *  determines if an variable is an object or not
 *
 * @private
 * @param {*} x the variable that needs to be checked
 * @returns {boolean} whether the variable is an object
 */
function isObject(x) {
  return x && Object.prototype.toString.call(x) === '[object Object]'
}

export {
  capitalise,
  trim_whitespace,
  isArray,
  isObject,
}
