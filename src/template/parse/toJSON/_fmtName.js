/**
 * normalize template names
 *
 * @private
 * @param {string} name the template name to normalize
 * @returns {string} a normalized template name
 */
function fmtName (name) {
  name = (name || '').trim()
  name = name.toLowerCase()
  name = name.replace(/_/g, ' ')
  return name
}
export default fmtName
