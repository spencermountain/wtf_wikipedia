import version from './_version.js'
import templates from './templates.js'

const plugin = (_models, _templates) => {
  // add new templates
  Object.assign(_templates, templates)
}
plugin.version = version

export default plugin
