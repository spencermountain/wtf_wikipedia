const parseSentence = require('../../04-sentence/').oneSentence;
const findRows = require('./_findRows');
const handleSpans = require('./_spans');

//additional table-cruft to remove before parseLine method
const cleanText = function(str) {
  // str = parseSentence(str).text();
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=['"].*?["']/, '');
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '');
  str = str.trim();
  return str;
};

//'!' starts a header-row
const findHeaders = function(rows) {
  let headers = [];
  let first = rows[0];
  if (first && first[0] && /^!/.test(first[0]) === true) {
    headers = first.map((h) => {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      return h;
    });
    rows.shift();
  }
  return headers;
};

// let cell = parseSentence(str);
// cell.text(cleanText(cell.text()));

//turn headers, array into an object
const parseRow = function(arr, headers) {
  let row = {};
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1);
    let s = parseSentence(str);
    s.text(cleanText(s.text()));
    row[h] = s;
  });
  return row;
};

//turn a {|...table string into an array of arrays
const parseTable = function(wiki) {
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  lines = lines.map(l => l.trim());
  let rows = findRows(lines);
  let headers = findHeaders(rows);
  rows = handleSpans(rows);
  //index them by their header
  let table = rows.map(arr => {
    return parseRow(arr, headers);
  });
  return table;
};

module.exports = parseTable;
