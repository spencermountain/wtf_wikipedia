const languages = require('../../../_data/languages')

const templates = {}
//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach((k) => {
  templates['lang-' + k] = templates['lang-de']
})

module.exports = templates
