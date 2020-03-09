const findTemplates = require('./find')
const parseTemplate = require('./parse')
const Template = require('./Template')

//reduce the scary recursive situations
const parseTemplates = function(wiki, data) {
  // nested data-structure of templates
  let templates = findTemplates(wiki)
  let list = []

  // recursive template-parser
  const doOne = function(obj) {
    // do tail-first recurion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach(doOne)
    }
    wiki = parseTemplate(obj.tmpl, list)
  }

  //kick it off
  templates.forEach(obj => doOne(obj))
  // console.log(data.templates)
  // data.templates = []
  data.infoboxes = []
  data.references = []
  data.templates = list.map(obj => new Template(obj))

  return wiki
}

module.exports = parseTemplates
