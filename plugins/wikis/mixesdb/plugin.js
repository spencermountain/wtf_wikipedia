const templates = require('./templates')

const plugin = (models, _templates) => {
  // add new templates
  Object.assign(_templates, templates)
}
module.exports = plugin
