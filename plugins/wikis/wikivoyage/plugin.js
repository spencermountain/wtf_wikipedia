import templates from './templates.js'

function plugin (_models, _templates) {
  // add new templates
  Object.assign(_templates, templates)
}
export default plugin
