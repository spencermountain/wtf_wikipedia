//interpret ==heading== lines
const fns = require('../../lib/helpers');
const list = require('./lists');
const parseSentences = require('./sentence');
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
    sentences: []
  };
};

const parseSections = function(lines) {
  let arr = [parseHeading([])];
  for (let i = 0; i < lines.length; i++) {
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
    //list or sentence?
    let section = arr[arr.length - 1];
    if (line && list.isList(line)) {
      section.list = section.list || [];
      section.list.push(line);
    } else {
      let sentenceArr = parseSentences(line);
      section.sentences = section.sentences.concat(sentenceArr);
    }
  }
  for (let i = 0; i < arr.length; i++) {
    var section = arr[i];
    if (section.list) {
      section.list = list.cleanList(section.list);
    }
  }
  return arr;
};

const parseText = function(r, wiki) {
  //next, map each line into a parsable sentence
  let lines = wiki.replace(/\r/g, '').split(/\n/);

  r.sections = parseSections(lines);

  return wiki;
};

module.exports = parseText;
