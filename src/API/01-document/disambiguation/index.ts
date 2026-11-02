const shouldSkip = /^see also$/i

const escapeRegExp = (str) => {
  str = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  return new RegExp(str, 'i')
}

// A '''[[berry]]''' is a small, pulpy and often edible fruit in non-technical language.
const getMain = function (s) {
  const txt = s.text().slice(0, 120)
  if (!/ is /.test(txt)) {
    return null
  }
  const link = s.links()[0]
  if (!link) {
    return null
  }
  const reg = escapeRegExp(link.text())
  // ensure the link is toward the start of the sentence
  const m = txt.match(reg)
  if (!m || m.index > 20) {
    return null
  }
  return link.page()
}

const getTitle = function (doc) {
  let title = doc.title || ''
  title = title.replace(/ \(disambig|disambiguation\)$/, '')
  return title
}

// interpret lists of possible pages into a structured disambiguation result
const parseDisambig = function (doc) {
  const opening = doc.sections()[0].sentences().slice(0, 2)
  const hasIntroduction = opening.some((sentence) => / may (also )?refer to\b/i.test(sentence.text()))
  if (!doc.isDisambiguation() && !hasIntroduction) {
    return null
  }
  const intro = doc.sections()[0].sentences()[0]
  const main = getMain(intro)

  const pages = []
  doc.sections().forEach((s) => {
    const title = s.title()
    if (shouldSkip.test(title) === true) {
      return
    }
    s.lists().forEach((list) => {
      list.lines().forEach((line) => {
        const found = line.json('lg')
        if (found) {
          found.page = found.links[0]?.page
          found.section = title
          pages.push(found)
        }
      })
    })
  })
  return {
    text: getTitle(doc),
    main: main,
    pages: pages,
  }
}

export default parseDisambig
