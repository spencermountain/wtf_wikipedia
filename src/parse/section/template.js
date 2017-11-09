const parseCoord = require('./coordinates');
const regs = {
  main: /\{\{main( article)?\|(.*?)\}\}/i,
  wide_image: /\{\{wide image\|(.*?)\}\}/i,
  coord: /\{\{coord\|(.*?)\}\}/i
};

//just some easy, supported ones
const parseTemplates = function(section, wiki, r) {
  let templates = {};

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
  //{{coord|43|42|N|79|24|W|region:CA-ON|display=inline,title}}
  let coord = wiki.match(regs.coord);
  if (coord !== null) {
    r.coordinates.push(parseCoord(coord[1]));
  }
  if (Object.keys(templates).length > 0) {
    section.templates = templates;
  }
  return wiki;
};
module.exports = parseTemplates;
