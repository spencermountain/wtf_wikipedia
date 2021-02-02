const findTemplates = require('./find/01-nested')
const parse = require('./parse')
const sortOut = require('./sortOut')

//find + parse all templates in the section
const process = function (section, doc) {
  let wiki = section._wiki
  //nested data-structure of templates
  let list = findTemplates(wiki)
  let keep = []
  //recursive template-parser
  const parseThem = function (obj, parent) {
    obj.parent = parent
    //do tail-first recursion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((ch) => parseThem(ch, obj))
    }
    obj.out = parse(obj, keep, doc)
    //remove the text from every parent
    const removeIt = function (node, body, out) {
      if (node.parent) {
        node.parent.body = node.parent.body.replace(body, out)
        removeIt(node.parent, body, out)
      }
    }
    removeIt(obj, obj.body, obj.out)
    wiki = wiki.replace(obj.body, obj.out)
  }

  //kick it off
  list.forEach((node) => parseThem(node, null))

  let domain = doc ? doc._domain : null
  let { infoboxes, references, templates } = sortOut(keep, domain)

  //sort-out the templates we decide to keep
  section._infoboxes = section._infoboxes || []
  section._references = section._references || []
  section._templates = section._templates || []

  section._infoboxes = section._infoboxes.concat(infoboxes)
  section._references = section._references.concat(references)
  section._templates = section._templates.concat(templates)

  //remove the templates from our wiki text
  list.forEach((node) => {
    wiki = wiki.replace(node.body, node.out)
  })
  section._wiki = wiki
}

module.exports = process
