/**
 * applies the the key values of defaults to options
 *
 * @private
 * @param {object} options the user options
 * @param {object} defaults the defaults
 * @returns {object} the user options with the defaults applied
 */
const setDefaults = function (options, defaults) {
  return Object.assign({}, defaults, options)
}
export default setDefaults
