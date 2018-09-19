const parseSentence = require('../04-sentence/').oneSentence;
const findRows = require('./findRows');

//additional table-cruft to remove before parseLine method
const cleanText = function(str) {
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=".*?"/, '');
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '');
  return str;
};

//'!' starts a header-row
const findHeaders = function(rows) {
  let headings = [];
  let first = rows[0];
  if (first && first[0] && /^!/.test(first[0]) === true) {
    headings = first.map((h) => {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      return h;
    });
    rows.shift();
  }
  return headings;
};

//turn a {|...table string into an array of arrays
const parseTable = function(wiki) {
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  lines = lines.map(l => l.trim());
  let rows = findRows(lines);
  let headers = findHeaders(rows);
  //index them by their header
  let table = rows.map(arr => {
    let row = {};
    arr.forEach((str, i) => {
      let header = headers[i] || 'col' + (i + 1);
      let cell = parseSentence(str);
      cell.text(cleanText(cell.text()));
      row[header] = cell;
    });
    return row;
  });
  return table;
};

module.exports = parseTable;
