//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  list: require('./list'),
  image: require('./image'),
  table: require('./table'),
  template: require('./template'),
  sentence: require('./sentence/sentence')
};
const section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

const parseSection = function(section, wiki) {
  // //parse the tables
  wiki = parse.table(section, wiki);
  // //parse the lists
  wiki = parse.list(section, wiki);
  //supoprted things like {{main}}
  wiki = parse.template(section, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  wiki = parse.image(section, wiki);
  //do each sentence
  wiki = parse.sentence(section, wiki);
  // section.wiki = wiki;
  return section;
};

const makeSections = function(wiki) {
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
    section = parseSection(section, txt);
    sections.push(section);
  }
  return sections;
};

module.exports = makeSections;
