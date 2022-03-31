import { mappings } from '../../schema/_data-fns.js'

const fromSection = function (doc) {
  let found = []
  let titles = doc.sections().map((s) => {
    let str = s.title()
    str = str.toLowerCase().trim()
    return str
  })
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]
    if (mappings.sections.hasOwnProperty(title)) {
      found.push({ type: mappings.sections[title], reason: title })
    }
  }
  return found
}
export default fromSection
