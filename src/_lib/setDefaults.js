/**
 * applies the the key values of defaults to options
 *
 * @private
 * @param {{}} options the user options
 * @param {{}} defaults the defaults
 * @returns {{}} the user options with the defaults applied
 */
const setDefaults = function (options, defaults) {
  return Object.assign({}, defaults, options)
}
module.exports = setDefaults
