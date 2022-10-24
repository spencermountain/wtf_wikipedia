/**
 * this function crates a function that calls the plural version of the method
 *
 * @param {string} plural the plural of the word
 * @returns {function} a Function that calls the plural version of the method
 */
function singularFactory (plural) {
  return function (clue) {
    let arr = this[plural](clue)
    return arr[0] || null
  }
}


/**
 * this function crates a function that calls the plural version of the method
 *
 * @param {string | number} plural the plural of the word
 * @returns {function} a Function that calls the plural version of the method
 */
function singularFactoryWithNumber (plural) {
  return function (clue) {
    let arr = this[plural](clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0] || null
  }
}

export {singularFactory, singularFactoryWithNumber}