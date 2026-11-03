import { defaultWorld } from '../../../world/index.ts'
const mayAlsoReg = /. may (also )?refer to\b/i

// templates that signal page is not a disambiguation
const notDisambig = new Set(['about', 'for', 'for multi', 'other people', 'other uses of', 'distinguish'])

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
  let found = templates.find((name) => defaultWorld._cached.disambigTemplates.has(name))
  if (found) {
    return true
  }
  // check for (disambiguation) in title
  let title = doc.title
  if (title && defaultWorld._cached.disambigTitleReg.test(title) === true) {
    return true
  }
  // does it have a non-disambig hatnote? these are kind 'hatnote', so go by their name
  const names = doc.templates().map((tmpl) => (tmpl.json().template || '').toLowerCase())
  let notDisamb = names.find((name) => notDisambig.has(name))
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
