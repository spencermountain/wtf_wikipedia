import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import parseTemplates from '../../templates/index.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'

//parses out the `Election_box` template - a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box
const parseElection = function (section: SectionData, opts: DocInfo = defaults) {
  section.remaining = section.remaining.replace(/\{\{election box begin(.+?)\{\{election box end\}\}/gis, (tmpl) => {
    //put it through our full template parser..
    const { templates } = parseTemplates(tmpl, opts)

    const start = templates.find((t) => t.kind === 'election box begin')
    let candidates = templates.filter((t) => t.kind === 'election box candidate')
    const summary = templates.find((t) => t.kind === 'election box gain' || t.kind === 'election box hold')

    if (candidates.length > 0 || summary) {
      const data = { title: start?.data.title, candidates, summary: summary?.data }
      section.templates.push(makeResult(tmpl, 'election box', data, '', opts))
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}

export default parseElection
