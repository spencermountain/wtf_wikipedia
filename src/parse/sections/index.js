//interpret ==heading== lines
const parse = {
  list: require('./list'),
  table: require('./table'),
  heading: require('./heading'),
  sentence: require('./sentence')
};

const section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})\n/g;

const parseSection = function(r, wiki) {
  // //parse the tables
  wiki = parse.table(r, wiki);
  // //parse the lists
  // wiki = parse.list(r, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  // wiki = parse_recursion(r, wiki);
  // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // //kill the rest of templates
  wiki = wiki.replace(/\{\{.*?\}\}/g, '');
  return r;
};

const splitSection = function(r, wiki) {
  let split = wiki.split(section_reg);
  let sections = [];
  for (let i = 0; i < split.length; i += 2) {
    let title = split[i - 1] || '';
    let txt = split[i] || '';
    let section = parse.heading(title);
    section = parseSection(section, txt);
    sections.push(section);
  }
  return sections;
};

module.exports = splitSection;
