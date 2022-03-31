import Infobox from '../infobox/Infobox.js'
import Reference from '../reference/Reference.js'
import Template from './Template.js'
const isCitation = /^(cite |citation)/i

const referenceTypes = {
  citation: true,
  refn: true,
  harvnb: true,
  source: true, //wikinews
}

// split Infoboxes from templates and references
const sortOut = function (list, domain) {
  let res = {
    infoboxes: [],
    templates: [],
    references: [],
  }
  //remove references and infoboxes from our list
  list.forEach((obj) => {
    let json = obj.json
    let kind = json.template || json.type || json.name
    // is it a Reference?
    if (referenceTypes[kind] === true || isCitation.test(kind) === true) {
      res.references.push(new Reference(json, obj.wiki))
      return
    }
    // is it an Infobox?
    if (json.template === 'infobox' && json.subbox !== 'yes') {
      json.domain = domain //infoboxes need this for images, i guess
      json.data = json.data || {} //validate it a little
      res.infoboxes.push(new Infobox(json, obj.wiki))
      return
    }
    // otherwise, it's just a template
    res.templates.push(new Template(json, obj.text, obj.wiki))
  })
  return res
}

export default sortOut
