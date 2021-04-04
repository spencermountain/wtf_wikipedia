const Section = require('./Section')
const i18n = require('../_data/i18n')
const isReference = new RegExp('^(' + i18n.references.join('|') + '):?', 'i')
const section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
}

/**
 * filters out the reference section and empty sections and
 *
 * @param {Section[]} sections
 * @returns {Section[]} all the section
 */
const removeReferenceSection = function (sections) {
  return sections.filter((s, i) => {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true
      }

      //does it have some wacky templates?
      if (s.templates().length > 0) {
        return true
      }

      //what it has children? awkward
      if (sections[i + 1] && sections[i + 1].depth() > s.depth()) {
        sections[i + 1]._depth -= 1 //move it up a level?...
      }
      return false
    }
    return true
  })
}

/**
 * this function splits the wiki texts on '=' and puts every part in a Section Object
 * it also pre processes the section text for the Section object
 * then it filters out the reference section
 *
 * @private
 * @param {Document} doc the document that contains the wiki text
 * @returns {Section[]} the sections that are parsed out
 */
const parseSections = function (doc) {
  let sections = []
  let splits = doc._wiki.split(section_reg)

  for (let i = 0; i < splits.length; i += 2) {
    let heading = splits[i - 1] || ''
    let wiki = splits[i] || ''

    if (wiki === '' && heading === '') {
      //usually an empty 'intro' section
      continue
    }

    let data = {
      title: '',
      depth: null,
      wiki: wiki,
    }

    //figure-out title and depth
    parse.heading(data, heading)

    sections.push(new Section(data, doc))
  }

  //remove empty references section
  return removeReferenceSection(sections)
}

module.exports = parseSections
