//interpret ==heading== lines
const fns = require('../../lib/helpers');
const heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

const parseHeading = function(head) {
  let title = head[2] || '';
  title = fns.trim_whitespace(title);
  let depth = 1;
  if (head[1]) {
    depth = head[1].length;
  }
  return {
    title: title,
    depth: depth,
    lines: []
  };
};

const sections = function(lines) {
  let arr = [parseHeading([])];
  for (var i = 0; i < lines.length; i++) {
    let line = lines[i];
    //empty lines
    if (!line) {
      continue;
    }
    //handle new ==headings==
    let header = line.match(heading_reg);
    if (header !== null) {
      arr.push(parseHeading(header));
      continue;
    }
    arr[arr.length - 1].lines.push(line);
  }
  return arr;
};

module.exports = sections;
