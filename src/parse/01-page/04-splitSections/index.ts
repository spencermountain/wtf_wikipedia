import defaults from '../../../_lib/defaults.ts'
// import { references } from '../../_data/i18n.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'
//interpret ==heading== lines
import parseHeading from './heading.ts'

// const isReference = new RegExp('^(' + references.join('|') + '):?', 'i')
const section_reg = /(?:\n|^)(={2,6}.{1,200}?={2,6})/g

//split the wiki text on '=' headings, wrap each part in a Section, then drop the reference section
const parseSections = function (pageWiki: string, opts: DocInfo = defaults) {
  let sections: SectionData[] = []
  let index = 0
  let splits = pageWiki.split(section_reg)
  for (let i = 0; i < splits.length; i += 2) {
    let heading = splits[i - 1] || ''
    let wiki = splits[i] || ''
    //usually an empty 'intro' section
    if (wiki === '' && heading === '') {
      continue
    }

    //figure-out title and depth
    let { block, depth } = parseHeading(heading, opts)
    let section: SectionData = {
      title: block,
      depth,
      wiki,
      index,
      remaining: wiki,
      templates: [],
      tables: [],
      infoboxes: [],
      references: [],
      paragraphs: [],
    }
    sections.push(section)
    index += 1
  }

  //remove empty references section
  // return removeReferenceSection(sections)
  return sections
}

export default parseSections
