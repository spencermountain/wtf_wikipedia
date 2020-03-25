const parse = require('../template/_parsers/parse')
// const parse = require('../../templates/wikipedia/page').citation;
const parseSentence = require('../04-sentence').fromText
const Reference = require('./Reference')

//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function(str) {
  return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false
}

const parseCitation = function(tmpl) {
  let obj = parse(tmpl)
  obj.type = obj.template.replace(/cite /, '')
  obj.template = 'citation'
  return obj
}

//handle unstructured ones - <ref>some text</ref>
const parseInline = function(str) {
  let obj = parseSentence(str) || {}
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  }
}

// parse <ref></ref> xml tags
const parseRefs = function(section) {
  let references = []
  let wiki = section.wiki
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl)
      if (obj) {
        references.push(obj)
      }
      wiki = wiki.replace(tmpl, '')
    } else {
      references.push(parseInline(tmpl))
    }
    return ' '
  })
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ')
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl)
      if (obj) {
        references.push(obj)
      }
      wiki = wiki.replace(tmpl, '')
    } else {
      references.push(parseInline(tmpl))
    }
    return ' '
  })
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' ') //<samp name="asd">
  section.references = references.map(r => new Reference(r))
  section.wiki = wiki
}
module.exports = parseRefs
