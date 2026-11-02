import spacetime from 'spacetime'

const parseSentence = function (doc) {
  const s = doc.sentences()[0]
  if (!s) {
    return null
  }
  let txt = s.text() || ''
  const paren = txt.match(/^[^(\r\n\u2028\u2029]*(\(.*\))/m)
  if (!paren || !paren[1]) {
    return null
  }
  txt = paren[1] || ''
  txt = txt.trim()
  txt = txt.replace(/^\(/, '')
  txt = txt.replace(/\)$/, '')
  // birth–death separator: a spaced dash, like '24 June 1931 – 7 February 2015'
  let split = txt.split(/ [–—-] /)
  // or a tight year-pair, like '1625–1696'
  if (split.length === 1) {
    const years = txt.match(/^(\d{3,4})\s*[–—-]\s*(\d{3,4})$/)
    if (years) {
      split = [years[1], years[2]]
    }
  }
  split = split.filter((str) => str)
  // got birth/death info
  if (split[0] && split[1] && split.length === 2) {
    return {
      birth: split[0],
      death: split[1],
    }
  }
  // try for just birth date in parentheses
  if (split[0]) {
    let str = split[0]
    // 'born' may follow a pronunciation or alias, like '/ˈɡrɛtski/; born January 26, 1961'
    const born = str.match(/\bborn\s+(?:c\.\s*)?(\S.*)$/i)
    if (born) {
      str = born[1]
    } else {
      str = str.replace(/^(?:née?|ne)\s+(?:c\.\s*)?/, '')
    }
    str = str.trim()
    const d = spacetime(str)
    if (d.isValid()) {
      return {
        birth: str,
      }
    }
  }
  return null
}
export default parseSentence
