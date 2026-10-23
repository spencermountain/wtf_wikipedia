import { stubs } from '../../_data/i18n/index.ts'
let allStubs = new Set(stubs)

const isStub = function (doc) {
  // Check for stub templates.
  const templates = doc.templates()
  return templates.some((t) => {
    let name = t.type || ''
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
      let word = words.at(-1)
      if (allStubs.has(word)) {
        return true
      }
    }
    return false
  })
}
export default isStub
