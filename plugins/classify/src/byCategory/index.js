const patterns = require('./patterns')

const mapping = {
  living_people: 'Person'
}

const byPattern = function(cat) {
  let types = Object.keys(patterns)
  for (let i = 0; i < types.length; i++) {
    const element = types[i]
  }
}

const byCategory = function(doc) {
  let cats = doc.categories()
  // clean them up a bit
  cats = cats.map(cat => {
    cat = cat.toLowerCase()
    cat = cat.replace(/^(category|categorie|kategori): ?/i, '')
    cat = cat.replace(/ /g, '_')
    return cat.trim()
  })
  // loop through each
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i]
    // try our 1-to-1 mapping
    if (mapping.hasOwnProperty(cat)) {
      return mapping[cat]
    }
    // loop through our patterns
    let found = byPattern(cat)
    if (found) {
      return found
    }
  }
}
module.exports = byCategory
