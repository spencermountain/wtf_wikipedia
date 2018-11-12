const Section = require('./Section');
const isReference = /^(references?|einzelnachweise|referencias|références|notes et références|脚注|referenser|bronnen|примечания):?/i; //todo support more languages
const section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g;

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  table: require('../table'),
  paragraphs: require('../03-paragraph'),
  templates: require('../templates'),
  references: require('../reference'),
  xmlTemplates: require('./xml-templates')
};

const oneSection = function( wiki, data, options) {
  wiki = parse.xmlTemplates(data, wiki, options);
  //parse-out the <ref></ref> tags
  wiki = parse.references(wiki, data);
  //parse-out all {{templates}}
  wiki = parse.templates(wiki, data, options);
  // //parse the tables
  wiki = parse.table(data, wiki);
  //now parse all double-newlines
  let res = parse.paragraphs(wiki, options);
  data.paragraphs = res.paragraphs;
  wiki = res.wiki;
  data = new Section(data, wiki);
  return data;
};

//we re-create this in html/markdown outputs
const removeReferenceSection = function(sections) {
  return sections.filter((s, i) => {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true;
      }
      //does it have some wacky templates?
      if (s.templates().length > 0) {
        return true;
      }
      //what it has children? awkward
      if (sections[i + 1] && sections[i + 1].depth > s.depth) {
        sections[i + 1].depth -= 1; //move it up a level?...
      }
      return false;
    }
    return true;
  });
};

const parseSections = function(wiki, options) {
  let split = wiki.split(section_reg);
  let sections = [];
  for (let i = 0; i < split.length; i += 2) {
    let heading = split[i - 1] || '';
    let content = split[i] || '';
    if (content === '' && heading === '') { //usually an empty 'intro' section
      continue;
    }
    let data = {
      title: '',
      depth: null,
      templates: [],
      infoboxes: [],
      references: [],
    };
    //figure-out title/depth
    parse.heading(data, heading);
    //parse it up
    let s = oneSection(content, data, options);
    sections.push(s);
  }
  //remove empty references section
  sections = removeReferenceSection(sections);

  return sections;
};

module.exports = parseSections;
