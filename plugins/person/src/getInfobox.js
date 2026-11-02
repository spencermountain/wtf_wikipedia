import mapping from './_lib/_infoboxes.js'

// find the first non-empty field in any person-infobox
const getField = function (doc, props) {
  const infoboxes = doc.infoboxes()
  for (let i = 0; i < infoboxes.length; i++) {
    const inf = infoboxes[i]
    // 'Infobox football_biography' and 'Infobox football biography' are the same
    const type = inf.type().toLowerCase().trim().replace(/_/g, ' ')
    if (Object.hasOwn(mapping, type)) {
      for (let k = 0; k < props.length; k++) {
        const s = inf.get(props[k])
        if (s && s.text()) {
          return s
        }
      }
    }
  }
  return null
}

// the first non-empty field's text
const byInfobox = function (doc, props) {
  const s = getField(doc, props)
  if (s) {
    return s.text()
  }
  return null
}

export { getField }
export default byInfobox
