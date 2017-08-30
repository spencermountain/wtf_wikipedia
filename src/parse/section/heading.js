const fns = require('../../lib/helpers');
const heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
const parseHeading = function(str) {
  let heading = str.match(heading_reg);
  if (!heading) {
    return {
      title: '',
      depth: 0
    };
  }
  let title = heading[2] || '';
  title = fns.trim_whitespace(title);
  let depth = 1;
  if (heading[1]) {
    depth = heading[1].length - 1;
  }
  return {
    title: title,
    depth: depth
  };
};
module.exports = parseHeading;
