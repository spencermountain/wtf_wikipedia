const parseSentence = require('../../../04-sentence/').oneSentence;
const findRows = require('./_findRows');
const handleSpans = require('./_spans');
//common ones
const headings = {
  name: true,
  age: true,
  born: true,
  date: true,
  year: true,
  city: true,
  country: true,
  population: true,
  count: true,
  number: true,
};

//additional table-cruft to remove before parseLine method
const cleanText = function(str) {
  str = parseSentence(str).text();
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
const findHeaders = function( rows = [] ) {
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
  //try the second row, too (overwrite first-row, if it exists)
  first = rows[0];
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      if (Boolean(h) === true) {
        headers[i] = h;
      }
    });
    rows.shift();
  }
  return headers;
};

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

//should we use the first row as a the headers?
const firstRowHeader = function(rows) {
  if (rows.length <= 3) {
    return [];
  }
  let want = rows[rows.length - 1];
  let headers = rows[0].slice(0);
  //should we try the second row?
  if (headers.length < want.length && headers.length <= 3) {
    headers = rows[1].slice(0);
  }
  headers = headers.map((h) => {
    h = h.replace(/^\! */, '');
    h = parseSentence(h).text();
    h = cleanText(h);
    h = h.toLowerCase();
    return h;
  });
  for(let i = 0; i < headers.length; i += 1) {
    if (headings.hasOwnProperty(headers[i])) {
      rows.shift();
      return headers;
    }
  }
  return [];
};

//turn a {|...table string into an array of arrays
const parseTable = function(wiki) {
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  lines = lines.map(l => l.trim());
  let rows = findRows(lines);
  //support colspan, rowspan...
  rows = handleSpans(rows);
  //grab the header rows
  let headers = findHeaders(rows);
  if (!headers || headers.length === 0) {
    headers = firstRowHeader(rows);
  }
  //index each column by it's header
  let table = rows.map(arr => {
    return parseRow(arr, headers);
  });
  return table;
};

module.exports = parseTable;
