const i18n = require('../_data/disambig').reduce((h, str) => {
  h[str] = true
  return h
}, {})

//special disambig-templates en-wikipedia uses
let d = ' disambiguation'
const english = [
  'dab',
  'dab',
  'disamb',
  'disambig',
  'geodis',
  'hndis',
  'setindex',
  'ship index',
  'split dab',
  'sport index',
  'wp disambig',
  'disambiguation cleanup',
  'airport' + d,
  'biology' + d,
  'call sign' + d,
  'caselaw' + d,
  'chinese title' + d,
  'genus' + d,
  'hospital' + d,
  'lake index',
  'letter' + d,
  'letter-number combination' + d,
  'mathematical' + d,
  'military unit' + d,
  'mountainindex',
  'number' + d,
  'phonetics' + d,
  'place name' + d,
  'portal' + d,
  'road' + d,
  'school' + d,
  'species latin name abbreviation' + d,
  'species latin name' + d,
  'station' + d,
  'synagogue' + d,
  'taxonomic authority' + d,
  'taxonomy' + d
].reduce((h, str) => {
  h[str] = true
  return h
}, {})

const isDisambig = function(doc) {
  let templates = doc.templates()
  let found = templates.find(obj => {
    return english.hasOwnProperty(obj.template) || i18n.hasOwnProperty(obj.template)
  })
  if (found) {
    return true
  }
  // try 'may refer to' on first line for en-wiki?
  if (doc.sentences(0)) {
    let firstLine = doc.sentences(0).text()
    if (firstLine !== null && firstLine[0]) {
      if (/. may refer to ./i.test(firstLine) === true) {
        return true
      }
    }
  }
  return false
}

module.exports = isDisambig
