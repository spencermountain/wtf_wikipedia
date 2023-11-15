import parse from '../template/parse/toJSON/index.js'
import { fromText as parseSentence } from '../04-sentence/index.js'
import Reference from './Reference.js'
import getTemplates from '../template/find/02-flat.js'

//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function (str) {
  return /^ *\{\{ *(cite|citation)/i.test(str) && /\}\} *$/.test(str) && /citation needed/i.test(str) === false
}

const parseCitation = function (tmpl) {
  let obj = parse(tmpl)
  obj.type = obj.template.replace(/cite /, '')
  obj.template = 'citation'
  return obj
}

//handle unstructured ones - <ref>some text</ref>
const parseInline = function (str) {
  let obj = parseSentence(str) || {}
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj,
  }
}

//parse <ref></ref> xml tags
const parseRefs = function (section) {
  let references = []
  let wiki = section._wiki

  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function (all, txt) {
    let found = false
    // there could be more than 1 template inside a <ref><ref>
    let arr = getTemplates(txt)
    arr.forEach((tmpl) => {
      if (hasCitation(tmpl)) {
        let obj = parseCitation(tmpl)
        if (obj) {
          references.push({ json: obj, wiki: all })
          found = true
        }
        wiki = wiki.replace(tmpl, '')
      }
    })
    // parse as an inline reference
    if (!found) {
      references.push({ json: parseInline(txt), wiki: all })
    }
    return ' '
  })

  //<ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ')

  //<ref name=""></ref> (a gross copy of above parsing)
  wiki = wiki.replace(/ ?<ref [^>]{0,200}>([\s\S]{0,1800}?)<\/ref> ?/gi, function (all, txt) {
    let found = false
    // there could be more than 1 template inside a <ref><ref>
    let arr = getTemplates(txt)
    arr.forEach((tmpl) => {
      if (hasCitation(tmpl)) {
        let obj = parseCitation(tmpl)
        if (obj) {
          references.push({ json: obj, wiki: all })
          found = true
        }
        wiki = wiki.replace(tmpl, '')
      }
    })
    // parse as an inline reference
    if (!found) {
      references.push({ json: parseInline(txt), wiki: all })
    }
    return ' '
  })

  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ /]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ /]?> ?/g, ' ') //<samp name="asd">
  section._references = references.map((obj) => new Reference(obj.json, obj.wiki))
  section._wiki = wiki
}

export default parseRefs
