const Section = require('./Section');
const find_recursive = require('../lib/recursive_match');

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  list: require('./list'),
  image: require('../image'),
  interwiki: require('./interwiki'),
  table: require('./table'),
  templates: require('./templates'),
  eachSentence: require('../sentence').eachSentence
};
const section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

const parseSection = function(section, wiki, r, options) {
  // //parse the tables
  wiki = parse.table(section, wiki);
  // //parse the lists
  wiki = parse.list(section, wiki);
  //supoprted things like {{main}}
  wiki = parse.templates(section, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  //second, remove [[file:...[[]] ]] recursions
  let matches = find_recursive('[', ']', wiki);
  wiki = parse.image(matches, section, wiki, options);
  wiki = parse.interwiki(matches, section, wiki, options);
  //do each sentence
  wiki = parse.eachSentence(section, wiki);
  // section.wiki = wiki;
  section = new Section(section, r);
  return section;
};

const makeSections = function(r, wiki, options) {
  let split = wiki.split(section_reg); //.filter(s => s);
  let sections = [];
  for (let i = 0; i < split.length; i += 2) {
    let title = split[i - 1] || '';
    let txt = split[i] || '';
    let section = {
      title: '',
      depth: null
    };
    section = parse.heading(section, title);
    section = parseSection(section, txt, r, options);
    sections.push(section);
  }
  return sections;
};

module.exports = makeSections;
