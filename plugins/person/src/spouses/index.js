import byInfobox from '../getInfobox.js'

// 'Jane Doe (m. 1990; div. 2001)' → structured spouse
const parseSpouse = function (str) {
  const name = str.replace(/\([^()]*\)/g, '').replace(/\s+/g, ' ').trim()
  const from = (str.match(/\bm\.\s*(\d{4})/) || [])[1] || null
  const to = (str.match(/\b(?:died|div|divorced|sep|separated|ann|annulled|widowed)\.?\s*(\d{4})/i) || [])[1] || null
  const end = (str.match(/\b(died|div|divorced|sep|separated|ann|annulled|widowed)\b/i) || [])[1] || null
  return { name: name, from: from, to: to, end: end }
}

const spouses = function (doc) {
  // prefer structured {{marriage}} templates
  const found = doc.templates('marriage').map((tmpl) => tmpl.json().data)
  if (found.length > 0) {
    return found.map((d) => {
      return { name: d.spouse || '', from: d.from || null, to: d.to || null, end: d.end || null }
    })
  }
  // fall back to the infobox field's text
  const str = byInfobox(doc, ['spouse', 'spouses', 'partner'])
  if (!str) {
    return []
  }
  return str
    .split('\n')
    .map(parseSpouse)
    .filter((s) => s.name)
}
export default spouses
