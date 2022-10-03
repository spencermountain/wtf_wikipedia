import findTemplates from './find/01-nested.js'
import parseTemplate from './parse/index.js'
import sortOut from './sortOut.js'

// return a flat list of all {{templates}}
const allTemplates = function (wiki, doc) {
  let list = []
  //nested data-structure of templates
  let nested = findTemplates(wiki)
  //recursive template-parser
  const parseNested = function (obj, parent) {
    obj.parent = parent
    //do tail-first recursion
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((ch) => parseNested(ch, obj))
    }
    //parse template into json, return replacement wikitext
    let [text, json] = parseTemplate(obj, doc)
    obj.wiki = text
    if (json) {
      list.push({
        name: obj.name,
        wiki: obj.body,
        nested: Boolean(obj.parent),
        text: text,
        json: json,
      })
    }
    //remove the text from every parent
    const removeIt = function (node, body, out) {
      if (node.parent) {
        node.parent.body = node.parent.body.replace(body, out)
        removeIt(node.parent, body, out)
      }
    }
    removeIt(obj, obj.body, obj.wiki)
    wiki = wiki.replace(obj.body, obj.wiki)
  }
  //kick it off
  nested.forEach((node) => parseNested(node, null))
  //remove the templates from our wiki text
  nested.forEach((node) => {
    wiki = wiki.replace(node.body, node.wiki)
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

export default process
