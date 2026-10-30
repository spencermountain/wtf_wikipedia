// a section plus every subsection nested under it
const withChildren = function (doc, section) {
  const all = doc.sections()
  const start = section.index()
  const depth = section.depth()
  const res = [section]
  for (let i = start + 1; i < all.length; i += 1) {
    if (all[i].depth() <= depth) {
      break
    }
    res.push(all[i])
  }
  return res
}

const findSection = function (doc, titles = []) {
  const wanted = titles.map((t) => t.toLowerCase())
  return doc.sections().find((s) => wanted.includes(s.title().trim().toLowerCase())) || null
}

// table rows use normalized keys ('box_score'), but callers may pass raw ones ('Box Score')
const soften = (k = '') =>
  String(k)
    .toLowerCase()
    .replace(/[^a-z0-9#+/−]/g, '')

const getCell = function (row = {}, names = []) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== '') {
      return row[name]
    }
  }
  const keys = Object.keys(row)
  for (const name of names) {
    const soft = soften(name)
    const key = keys.find((k) => soften(k) === soft)
    if (key && row[key] !== undefined && row[key] !== '') {
      return row[key]
    }
  }
  return ''
}

export { withChildren, findSection, getCell }
