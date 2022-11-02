// const birthDate = require('./birthDate')
const shouldSkip = /see also/

function escapeRegExp (str) {
  str = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  return new RegExp(str, 'i')
}

function parseLine (line) {
  let link = line.link(0)
  if (!link || link.type() !== 'internal') {
    return null
  }
  let desc = line.text()
  let reg = escapeRegExp(link.text())
  // ensure the link is toward the start of the sentence
  let m = desc.match(reg)
  if (!m || m.index > 20) {
    return null
  }
  desc = desc.replace(reg, '')
  desc = desc.replace(/[,:]? ?/, '')
  return {
    link: link.page(),
    desc: desc,
  }
}

// A '''[[berry]]''' is a small, pulpy and often edible fruit in non-technical language.
function getMain (s) {
  let txt = s.text().slice(0, 120)
  if (!txt.match(/ is /)) {
    return null
  }
  let link = s.link(0)
  if (!link) {
    return null
  }
  let reg = escapeRegExp(link.text())
  // ensure the link is toward the start of the sentence
  let m = txt.match(reg)
  if (!m || m.index > 20) {
    return null
  }
  return link.page()
}

function getTitle (doc) {
  let title = doc.title() || ''
  title = title.replace(/ \(disambig|disambiguation\)$/, '')
  return title
}

function addMethod (models) {
  // parse a disambiguation page into an array of pages
  models.Doc.prototype.disambiguation = function () {
    if (this.isDisambiguation() !== true) {
      return null
    }
    // remove 'see also'
    let sec = this.section('see also')
    if (sec !== null) {
      sec.remove()
    }
    let intro = this.section().sentence()
    let main = getMain(intro)

    let pages = []
    this.sections().forEach((s) => {
      let title = s.title()
      if (shouldSkip.test(title) === true) {
        return
      }
      s.lists().forEach((list) => {
        list.lines().forEach((line) => {
          let found = parseLine(line)
          if (found) {
            found.section = title
            pages.push(found)
          }
        })
      })
    })
    return {
      text: getTitle(this),
      main: main,
      pages: pages,
    }
  }
  // alias
  models.Doc.prototype.disambig = models.Doc.prototype.disambiguation
}
export default addMethod
