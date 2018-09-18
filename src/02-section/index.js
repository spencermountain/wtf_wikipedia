const Section = require('./Section');
const find_recursive = require('../lib/recursive_match');
const isReference = /^(references?|einzelnachweise|referencias|références|notes et références|脚注|referenser|bronnen|примечания):?/i; //todo support more languages
const section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  image: require('../image'),
  interwiki: require('./interwiki'),
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
  // //parse the tables
  wiki = parse.table(data, wiki);
  //parse-out all {{templates}}
  wiki = parse.templates(wiki, data);
  // //parse+remove scary '[[ [[]] ]]' stuff
  //second, remove [[file:...[[]] ]] recursions
  let matches = find_recursive('[', ']', wiki);
  wiki = parse.image(matches, data, wiki, options);
  wiki = parse.interwiki(matches, data, wiki, options);

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
  let split = wiki.split(section_reg); //.filter(s => s);
  let sections = [];
  for (let i = 0; i < split.length; i += 2) {
    let heading = split[i - 1] || '';
    let content = split[i] || '';
    let data = {
      title: '',
      depth: null,
      templates: [],
      references: [],
    };
    //figure-out title/depth
    data = parse.heading(data, heading);
    //parse it up
    data = oneSection(content, data, options);
    sections.push(data);
  }
  //remove empty references section
  sections = removeReferenceSection(sections);

  return sections;
};

module.exports = parseSections;
