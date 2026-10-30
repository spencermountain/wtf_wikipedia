import { disambig_titles, disambig_templates } from '../../_data/i18n/index.ts'
import alt_disambig from './_disambig.ts'
const mayAlsoReg = /. may (also )?refer to\b/i

// templates that signal page is not a disambiguation
const notDisambig = new Set(['about', 'for', 'for multi', 'other people', 'other uses of', 'distinguish'])

const inTitle = new RegExp('. \\((' + disambig_titles.join('|') + ')\\)$', 'i')
const i18n_templates = new Set(disambig_templates)

// look for '... may refer to'
// const byText = function (s) {
//   if (!s) {
//     return false
//   }
//   let txt = s.text()
//   if (txt !== null && txt[0]) {
//     if (mayAlsoReg.test(txt) === true) {
//       return true
//     }
//   }
//   return false
// }

const isDisambig = function (doc) {
  // check for a {{disambig}} template
  const templates = doc.templates().map((tmpl) => tmpl.type)
  let found = templates.find((name) => {
    return alt_disambig.has(name) || i18n_templates.has(name)
  })
  if (found) {
    return true
  }
  // check for (disambiguation) in title
  let title = doc.title
  if (title && inTitle.test(title) === true) {
    return true
  }
  // does it have a non-disambig template?
  let notDisamb = templates.find((name) => notDisambig.has(name))
  if (notDisamb) {
    return false
  }
  //try 'may refer to' on first line for en-wiki?
  const str = doc.sentences()[0]?.text()
  if (str && mayAlsoReg.test(str) === true) {
    return true
  }
  return false
}

export default isDisambig
