const mapping = require('./templates')

const topk = function(arr) {
  let obj = {}
  arr.forEach(a => {
    obj[a] = obj[a] || 0
    obj[a] += 1
  })
  let res = Object.keys(obj).map(k => [k, obj[k]])
  return res.sort((a, b) => (a[1] > b[1] ? -1 : 0))
}

const byTemplate = function(doc) {
  let templates = doc.templates()
  let found = []
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i]
    if (mapping.hasOwnProperty(t.template)) {
      found.push(mapping[t.template])
    }
  }
  let top = topk(found)[0]
  if (top && top[0]) {
    return top[0]
  }
  return null
}

module.exports = byTemplate
