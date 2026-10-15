// import { references } from '../../_data/i18n.ts'
import type { SectionData } from '../../../types/index.ts'
//interpret ==heading== lines
import parseHeading from './heading.ts'

// const isReference = new RegExp('^(' + references.join('|') + '):?', 'i')
const section_reg = /(?:\n|^)(={2,6}.{1,200}?={2,6})/g

// const removeReferenceSection = function (sections) {
//   return sections.filter((s, i) => {
//     if (isReference.test(s.title()) === true) {
//       if (s.paragraphs().length > 0) {
//         return true
//       }
//
//       //does it have some wacky templates?
//       if (s.templates().length > 0) {
//         return true
//       }
//
//       //what it has children? awkward
//       if (sections[i + 1] && sections[i + 1].depth() > s.depth()) {
//         sections[i + 1]._depth -= 1 //move it up a level?...
//       }
//       return false
//     }
//     return true
//   })
// }

//split the wiki text on '=' headings, wrap each part in a Section, then drop the reference section
const parseSections = function (pageWiki: string) {
  let sections: SectionData[] = []
  let splits = pageWiki.split(section_reg)

  for (let i = 0; i < splits.length; i += 2) {
    let heading = splits[i - 1] || ''
    let wiki = splits[i] || ''

    //usually an empty 'intro' section
    if (wiki === '' && heading === '') {
      continue
    }

    //figure-out title and depth
    let section = parseHeading(heading)
    section.wiki = wiki
    sections.push(section)
  }

  //remove empty references section
  // return removeReferenceSection(sections)
  return sections
}

export default parseSections
