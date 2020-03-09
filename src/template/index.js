const Infobox = require('../infobox/Infobox')
const Reference = require('../reference/Reference')
const findTemplates = require('./find')
const parse = require('./parse')
const Template = require('./Template')
const isCitation = new RegExp('^(cite |citation)', 'i')

const references = {
  citation: true,
  refn: true,
  harvnb: true
}

const isReference = function(obj) {
  return references[obj.name] === true || isCitation.test(obj.name) === true
}

const isObject = function(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const isInfobox = function(obj) {
  return obj.name === 'infobox' && obj.data && isObject(obj.data)
}

//reduce the scary recursive situations
const allTemplates = function(wiki, data) {
  // nested data-structure of templates
  let list = findTemplates(wiki)
  let keep = []

  // recursive template-parser
  const parseThem = function(obj, parent) {
    obj.parent = parent
    // do tail-first recurion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach(ch => parseThem(ch, obj))
    }
    obj.out = parse(obj, keep)
    // remove the text from every parent
    const removeIt = function(node, body, out) {
      if (node.parent) {
        node.parent.body = node.parent.body.replace(body, out)
        removeIt(node.parent, body, out)
      }
    }
    removeIt(obj, obj.body, obj.out)
    wiki = wiki.replace(obj.body, obj.out)
  }

  //kick it off
  list.forEach(node => parseThem(node, null))

  // sort-out the templates we decide to keep
  data.infoboxes = []
  data.references = []
  // remove references and infoboxes from our list
  data.templates = keep.filter(obj => {
    if (isReference(obj) === true) {
      data.references.push(new Reference(obj))
      return false
    }
    if (isInfobox(obj) === true) {
      data.infoboxes.push(new Infobox(obj))
      return false
    }
    return true
  })
  data.templates = keep.map(obj => new Template(obj))

  // remove the templates from our wiki text
  list.forEach(node => {
    console.log(wiki.replace(node.body, node.out))
    wiki = wiki.replace(node.body, node.out)
  })
  return wiki
}

module.exports = allTemplates
