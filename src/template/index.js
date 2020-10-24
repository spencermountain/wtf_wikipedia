const Infobox = require('../infobox/Infobox')
const Reference = require('../reference/Reference')
const findTemplates = require('./find')
const parse = require('./parse')
const Template = require('./Template')
const isCitation = new RegExp('^(cite |citation)', 'i')

const references = {
  citation: true,
  refn: true,
  harvnb: true,
}

const isReference = function (obj) {
  return references[obj.template] === true || isCitation.test(obj.template) === true
}

const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const isInfobox = function (obj) {
  return obj.template === 'infobox' && obj.data && isObject(obj.data)
}

//reduce the scary recursive situations
const allTemplates = function (section, doc) {
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
    obj.out = parse(obj, keep)
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

  //sort-out the templates we decide to keep
  section._infoboxes = section._infoboxes || []
  section._references = section._references || []
  section._templates = section._templates || []
  section._templates = section._templates.concat(keep)
  //remove references and infoboxes from our list
  section._templates = section._templates.filter((obj) => {
    if (isReference(obj) === true) {
      section._references.push(new Reference(obj))
      return false
    }
    if (isInfobox(obj) === true) {
      obj.domain = doc._domain
      section._infoboxes.push(new Infobox(obj))
      return false
    }
    return true
  })
  section._templates = section._templates.map((obj) => new Template(obj))

  //remove the templates from our wiki text
  list.forEach((node) => {
    wiki = wiki.replace(node.body, node.out)
  })
  section._wiki = wiki
}

module.exports = allTemplates
