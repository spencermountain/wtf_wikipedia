import findTemplates from './find/01-nested.ts'
import parseTemplate from './parse/index.ts'
import sortOut from './sortOut.ts'
import type { TemplateData } from '../../types/index.ts'

// return a flat list of all {{templates}}
const allTemplates = function (wiki: string) {
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
    let [text, json] = parseTemplate(obj)
    obj.wiki = text
    if (json) {
      let template: TemplateData = {
        template: obj.name,
        name: obj.name,
        wiki: obj.body,
        nested: Boolean(obj.parent),
        text: text,
        data: json,
      }
      list.push(template)
    }
    //remove the text from every parent
    const removeIt = function (node, body, out) {
      if (node.parent) {
        node.parent.body = node.parent.body.replace(body, out)
        removeIt(node.parent, body, out)
      }
    }
    // Expanded equals signs are value text, not outer parameter assignments.
    let value = String(obj.wiki).replace(/=/g, '&#61;')
    removeIt(obj, obj.body, value)
    wiki = wiki.replace(obj.body, obj.parent ? value : obj.wiki)
  }
  //kick it off
  nested.forEach((node) => parseNested(node, null))
  //remove the templates from our wiki text
  nested.forEach((node) => {
    wiki = wiki.replace(node.body, node.wiki)
  })
  return { templates: list, remaining: wiki }
}

//find + parse all templates in the section
const process = function (wiki: string) {
  // find+parse them all
  let { templates, remaining } = allTemplates(wiki)
  // split-out references and infoboxes
  const { infoboxes, references, others } = sortOut(templates)
  return {
    infoboxes,
    references,
    templates: others,
    remaining,
  }
}

export default process
