const fns = require('../_lib/helpers');
const parseSentence = require('../04-sentence/').oneSentence;
const parseReferences = require('../reference/');
const heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
const parseHeading = function(data, str) {

  let heading = str.match(heading_reg);
  if (!heading) {
    data.title = '';
    data.depth = 0;
    return data;
  }
  let title = heading[2] || '';
  title = parseSentence(title).text();
  //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.
  title = title.replace(/\{\{.+?\}\}/, '');
  //same for references (i know..)
  title = parseReferences(title, {});
  //trim leading/trailing whitespace
  title = fns.trim_whitespace(title);
  let depth = 0;
  if (heading[1]) {
    depth = heading[1].length - 2;
  }
  data.title = title;
  data.depth = depth;
  return data;
};
module.exports = parseHeading;
