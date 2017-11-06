const regs = {
  main: /\{\{main( article)?\|(.*?)\}\}/i,
  wide_image: /\{\{wide image\|(.*?)\}\}/i,
  coord: /\{\{coord\|(.*?)\}\}/i
};
const dirMap = {
  N: 'north',
  n: 'north',
  S: 'south',
  s: 'south',
  E: 'east',
  e: 'east',
  w: 'west',
  W: 'west',
};
const parseCoord = function(str) {
  let arr = str.split('|');
  arr = arr.map(s => {
    if (/[a-zA-Z]/.test(s) === true) {
      return s;
    }
    return parseFloat(s, 10);
  });
  //support three formats
  //{{Coord|44.112|N|87.913|W|display=title}}
  //{{Coord|57|18|22|N|4|27|32|W|display=title}}
  //{{Coord|44.112|-87.913|display=title}}
  return arr;
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
