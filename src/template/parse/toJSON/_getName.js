import fmtName from './_fmtName.js'

/**
 * get the name of the template
 * templates are usually '{{name|stuff}}'
 *
 * @private
 * @param {string} tmpl the template text
 * @returns {string | null} the name of the template
 */
function getName (tmpl) {
  let name = null
  //{{name|foo}}
  if (/^\{\{[^\n]+\|/.test(tmpl)) {
    name = (tmpl.match(/^\{\{(.+?)\|/) || [])[1]
  } else if (tmpl.indexOf('\n') !== -1) {
    // {{name \n...
    name = (tmpl.match(/^\{\{(.+)\n/) || [])[1]
  } else {
    //{{name here}}
    name = (tmpl.match(/^\{\{(.+?)\}\}$/) || [])[1]
  }
  if (name) {
    name = name.replace(/:.*/, '')
    name = fmtName(name)
  }
  return name || null
}
export default getName
