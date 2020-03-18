const Section = require('./Section')
const i18n = require('../_data/i18n')
const isReference = new RegExp('^(' + i18n.references.join('|') + '):?', 'i')
const section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  table: require('../table'),
  paragraphs: require('../03-paragraph'),
  templates: require('../template'),
  references: require('../reference'),
  startEndTemplates: require('./start-to-end')
}

const oneSection = function(wiki, section, doc) {
  wiki = parse.startEndTemplates(section, wiki)
  //parse-out the <ref></ref> tags
  wiki = parse.references(wiki, section)
  //parse-out all {{templates}}
  wiki = parse.templates(wiki, section)
  // //parse the tables
  wiki = parse.table(section, wiki)
  //now parse all double-newlines
  let res = parse.paragraphs(wiki, doc)
  section.paragraphs = res.paragraphs
  wiki = res.wiki
  section = new Section(section, wiki)
  return section
}

const removeReferenceSection = function(sections) {
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
      if (sections[i + 1] && sections[i + 1].depth > s.depth) {
        sections[i + 1].depth -= 1 //move it up a level?...
      }
      return false
    }
    return true
  })
}

const parseSections = function(doc) {
  let split = doc.wiki.split(section_reg)
  let sections = []
  for (let i = 0; i < split.length; i += 2) {
    let heading = split[i - 1] || ''
    let content = split[i] || ''
    if (content === '' && heading === '') {
      //usually an empty 'intro' section
      continue
    }
    let section = {
      title: '',
      depth: null,
      templates: [],
      infoboxes: [],
      references: []
    }
    //figure-out title/depth
    parse.heading(section, heading)
    //parse it up
    let s = oneSection(content, section, doc)
    sections.push(s)
  }
  //remove empty references section
  doc.sections = removeReferenceSection(sections)
}

module.exports = parseSections
