// const parseCoord = require('./coordinates');
const parsers = require('./parsers');
const regs = {
  main: /\{\{main( article)?\|(.*?)\}\}/i,
  wide_image: /\{\{wide image\|(.*?)\}\}/i,
  tracklist: /\{\{tracklist\|(.*?)\}\}/i
};

//these templates apply only to this section,and we wont find them, say, inside a infobox
const parseTemplates = function(section, wiki) {
  let templates = {};
  // console.log(wiki);
  let name = (wiki.match(/\{\{([a-z 0-9]+)[\|\n]/i) || [])[1];
  // console.log(name);
  //{{main|toronto}}
  let main = wiki.match(regs.main);
  if (main) {
    templates.main = main[2].split('|');
    wiki = wiki.replace(regs.main, '');
  }
  //{{wide image|file:cool.jpg}}
  let wide = wiki.match(regs.wide_image);
  if (wide) {
    templates.wide_image = wide[1].split('|');
    wiki = wiki.replace(regs.wide_image, '');
  }
  if (Object.keys(templates).length > 0) {
    section.templates = templates;
  }
  return wiki;
};
module.exports = parseTemplates;
