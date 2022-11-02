import { patterns, mappings } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'

function byCategory (doc) {
  let found = []
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
    const category = cats[i]
    // try our 1-to-1 mapping
    if (mappings.categories.hasOwnProperty(category)) {
      found.push({ type: mappings.categories[category], reason: category })
      continue
    }
    // loop through our patterns
    let match = byPattern(category, patterns.categories)
    if (match) {
      found.push({ type: match, reason: category })
    }
  }
  return found
}
export default byCategory
