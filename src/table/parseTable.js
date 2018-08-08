const parseLine = require('../sentence/').parseLine;
const Sentence = require('../sentence/Sentence');
const findRows = require('./findRows');

const cleanText = function(str) {
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=".*?"/, '');
  return str;
};

//'!' starts a header-row
const findHeaders = function(rows) {
  let headings = [];
  let first = rows[0];
  if (first && first[0] && /^!/.test(first[0]) === true) {
    headings = first.map((h) => {
      h = h.replace(/^\! */, '');
      return h;
    });
    rows.shift();
  }
  return headings;
};

//turn a {|...table string into an array of arrays
const parseTable = function(wiki) {
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  let rows = findRows(lines);
  let headers = findHeaders(rows);
  //index them by their header
  let table = rows.map(arr => {
    let row = {};
    arr.forEach((str, i) => {
      let header = headers[i] || 'col-' + i;
      str = cleanText(str);
      row[header] = parseLine(str);
      row[header] = new Sentence(row[header]);
    });
    return row;
  });
  return table;
};

module.exports = parseTable;
