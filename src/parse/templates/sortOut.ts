import type { TemplateData } from '../../types/index.ts'
const isCitation = /^(cite |citation)/i

const referenceTypes = {
  citation: true,
  refn: true,
  harvnb: true,
  source: true, //wikinews
}

// split Infoboxes from templates and references
const sortOut = function (templates: TemplateData[]) {
  let res = {
    infoboxes: [],
    references: [],
    others: [],
  }
  //remove references and infoboxes from our list
  templates.forEach((obj) => {
    let json = obj.json
    let kind = json.template || json.type || json.name
    // is it a Reference?
    if (referenceTypes[kind] === true || isCitation.test(kind) === true) {
      json.wiki = obj.wiki
      res.references.push(json)
      return
    }
    // is it an Infobox?
    if (json.template === 'infobox' && json.subbox !== 'yes') {
      // json.domain = domain //infoboxes need this for images, i guess
      json.data ||= {} //validate it a little
      json.wiki = obj.wiki
      res.infoboxes.push(json)
      return
    }
    // otherwise, it's just a template
    json.text = obj.text
    json.wiki = obj.wiki
    res.others.push(json)
  })
  return res
}

export default sortOut
