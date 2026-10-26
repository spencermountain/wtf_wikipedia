import type { SectionData } from '../../../types/index.ts'

const parseLiterals = (section: SectionData) => {
  let wiki = section.remaining

  // these dunderscore literals are just like spooky templates
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, function (match) {
    section.templates.push({ template: match, kind: 'literal', text: '', data: null, wiki: `__${match}__` })
    return ''
  })
  //wiki user-signature syntax ~~~~
  wiki = wiki.replace(/~{2,3}/g, function (match) {
    section.templates.push({ template: 'signature', kind: 'literal', text: '', data: null, wiki: match })
    return ''
  })

  // markdown like horizontal lines ----
  wiki = wiki.replaceAll('----', function (match) {
    section.templates.push({ template: 'horizontal-rule', kind: 'literal', text: '', data: null, wiki: match })
    return ''
  })
  //these templates-in-templates...
  // wiki = wiki.replace(/\{\{\}\}/g, function (match) {
  //   section.templates.push({ template: '}', kind: 'literal', text: ' – ', data: null, wiki: match })
  //   return ' – '
  // })
  // wiki = wiki.replace(/\{\{\\\}\}/g, ' / ')

  section.remaining = wiki
  return section
}
export default parseLiterals
