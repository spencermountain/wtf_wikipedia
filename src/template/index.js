const findTemplates = require('./find/01-nested')
const halfParse = require('./half-parse')
const sortOut = require('./sortOut')

// return a flat list of all {{templates}}
const allTemplates = function (wiki, doc) {
  let list = []
  //nested data-structure of templates
  let nested = findTemplates(wiki)
  //recursive template-parser
  const parseThem = function (obj, parent) {
    obj.parent = parent
    //do tail-first recursion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((ch) => parseThem(ch, obj))
    }
    //parse it enough that we can identify it
    obj.out = halfParse(obj, list, doc)
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
  nested.forEach((node) => parseThem(node, null))
  //remove the templates from our wiki text
  nested.forEach((node) => {
    wiki = wiki.replace(node.body, node.out)
  })
  return { list: list, wiki: wiki }
}

//find + parse all templates in the section
const process = function (section, doc) {
  // find+parse them all
  let { list, wiki } = allTemplates(section._wiki, doc)
  // split-out references and infoboxes
  let domain = doc ? doc._domain : null
  let { infoboxes, references, templates } = sortOut(list, domain)

  //sort-out the templates we decide to keep
  section._infoboxes = section._infoboxes || []
  section._references = section._references || []
  section._templates = section._templates || []

  section._infoboxes = section._infoboxes.concat(infoboxes)
  section._references = section._references.concat(references)
  section._templates = section._templates.concat(templates)

  section._wiki = wiki
}

module.exports = process
