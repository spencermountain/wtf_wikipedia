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
    let json = obj.data || {}
    let kind = obj.template || obj.type || obj.name
    // is it a Reference?
    if (referenceTypes[kind] === true || isCitation.test(kind) === true) {
      res.references.push(obj)
      return
    }
    // is it an Infobox?
    if (obj.template === 'infobox' && json?.subbox !== 'yes') {
      // json.domain = domain //infoboxes need this for images, i guess
      res.infoboxes.push(obj)
      return
    }
    // otherwise, it's just a template
    res.others.push(obj)
  })
  return res
}

export default sortOut
