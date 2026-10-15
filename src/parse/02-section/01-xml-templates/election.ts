import parseTemplates from '../../template/index.ts'
import type { SectionData } from '../../../types/index.ts'

//parses out the `Election_box` template - a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box
const parseElection = function (section: SectionData) {
  section.remaining = section.remaining.replace(/\{\{election box begin(.+?)\{\{election box end\}\}/gis, (tmpl) => {
    let data = {
      _wiki: tmpl,
      _templates: [],
    }

    //put it through our full template parser..
    parseTemplates(data)

    //okay, pull it apart into something sensible..
    let templates = data._templates.map((t) => t.json())

    let start = templates.find((t) => t.template === 'election box') || {}
    let candidates = templates.filter((t) => t.template === 'election box candidate')
    let summary = templates.find((t) => t.template === 'election box gain' || t.template === 'election box hold') || {}

    if (candidates.length > 0 || summary) {
      section.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data,
      })
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}

export default parseElection
