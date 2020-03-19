let patterns = {
  'CreativeWork/Film': [/ \([0-9]{4} film\)$/]
}

const byTitle = function(doc) {
  let title = doc.title()
  if (!title) {
    return null
  }
  let keys = Object.keys(patterns)
  for (let o = 0; o < keys.length; o++) {
    const k = keys[o]

    for (let i = 0; i < patterns[k].length; i++) {
      const reg = patterns[k][i]
      if (reg.test(title)) {
        return k
      }
    }
  }
  return null
}
module.exports = byTitle
