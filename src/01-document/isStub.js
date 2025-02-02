import { stubs } from '../_data/i18n.js'
let allStubs = new Set(stubs)

const isStub = function (doc) {
  // check for a {{disambig}} template
  let templates = doc.templates().map((tmpl) => tmpl.json())

  return templates.some((t) => {
    let name = t.template || ''
    // try i18n templates like 'stubo'
    if (allStubs.has(name)) {
      return true
    }
    // english forms
    if (name === 'stub' || name.endsWith('-stub')) {
      return true
    }
    // look for i18n in last-word, like {{foo-stubo}}
    let words = name.split(/[- ]/)
    if (words.length > 1) {
      let word = words[words.length - 1]
      if (allStubs.has(word)) {
        return true
      }
    }
    return false
  })
}
export default isStub
