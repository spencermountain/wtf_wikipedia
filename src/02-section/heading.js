const fns = require('../lib/helpers');
const parseLine = require('../04-sentence/').parseLine;
const heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
const parseHeading = function(r, str) {
  let heading = str.match(heading_reg);
  if (!heading) {
    return {
      title: '',
      depth: 0,
      templates: []
    };
  }
  let title = heading[2] || '';
  title = parseLine(title).text;
  //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.
  title = title.replace(/\{\{.+?\}\}/, '');
  title = fns.trim_whitespace(title);

  let depth = 0;
  if (heading[1]) {
    depth = heading[1].length - 2;
  }
  r.title = title;
  r.depth = depth;
  return r;
};
module.exports = parseHeading;
