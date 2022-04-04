/**
 * removes the top and bottom off the template
 * so it removes tje '{{' and '}}'
 *
 * @private
 * @param {string} tmpl the string to be striped
 * @returns {string} the striped string
 */
const strip = function (tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '')
  tmpl = tmpl.replace(/\}\}$/, '')
  return tmpl
}
export default strip
