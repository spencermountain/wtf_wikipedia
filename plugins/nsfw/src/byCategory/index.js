import patterns from './patterns.js'
import mapping from './mapping.js'
import okay from './okay.js'
import byPattern from '../_byPattern.js'

const byCategory = function (doc) {
  const found = []
  let cats = doc.categories()
  // clean them up a bit
  cats = cats.map((cat) => {
    cat = cat.toLowerCase()
    cat = cat.replace(/^(category|categorie|kategori): ?/i, '')
    cat = cat.replace(/_/g, ' ')
    return cat.trim()
  })
  // loop through each
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i]
    // these false-flags are fine
    if (okay.hasOwnProperty(cat)) {
      continue
    }
    // try our 1-to-1 mapping
    if (mapping.hasOwnProperty(cat)) {
      found.push({ reason: mapping[cat], name: cat })
      continue
    }
    // loop through our patterns
    const match = byPattern(cat, patterns)
    if (match) {
      found.push({ reason: match, name: cat })
    }
  }
  return found
}
export default byCategory
