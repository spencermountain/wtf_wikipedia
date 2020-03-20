const patterns = require('./patterns')

const mapping = {
  'living people': 'Person',
  'date of birth unknown': 'Person',
  'possibly living people': 'Person',
  'place of birth missing': 'Person',
  'american films': 'CreativeWork/Film',
  'english-language films': 'CreativeWork/Film',
  'grammy award winners': 'Organization/MusicalGroup',
  'musical quartets': 'Organization/MusicalGroup',
  'musical duos': 'Organization/MusicalGroup',
  'musical trios': 'Organization/MusicalGroup'
}

const byPattern = function(cat) {
  let types = Object.keys(patterns)
  for (let i = 0; i < types.length; i++) {
    const key = types[i]
    for (let o = 0; o < patterns[key].length; o++) {
      const reg = patterns[key][o]
      if (reg.test(cat) === true) {
        return key
      }
    }
  }
}

const byCategory = function(doc) {
  let found = []
  let cats = doc.categories()
  // clean them up a bit
  cats = cats.map(cat => {
    cat = cat.toLowerCase()
    cat = cat.replace(/^(category|categorie|kategori): ?/i, '')
    cat = cat.replace(/_/g, ' ')
    return cat.trim()
  })
  // loop through each
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i]
    // try our 1-to-1 mapping
    if (mapping.hasOwnProperty(cat)) {
      found.push(mapping[cat])
      continue
    }
    // loop through our patterns
    let match = byPattern(cat)
    if (match) {
      found.push(match)
    }
  }
  return found
}
module.exports = byCategory
