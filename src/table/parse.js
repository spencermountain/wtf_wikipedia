const helpers = require('../lib/helpers');
const parseLine = require('../sentence/').parseLine;
const Sentence = require('../sentence/Sentence');
// const findHeaders = require('./findHeaders');
const findRows = require('./findRows');

const cleanText = function(str) {
  str = parseLine(str).text || '';
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  return str;
};

//'!' starts a header-row
const findHeaders = function(rows) {
  let headings = [];
  if (rows[0] && rows[0][0] && /^!/.test(rows[0][0]) === true) {
    headings = rows[0].map((h) => {
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
  let headings = findHeaders(rows);
  console.log(headings);
  console.log(rows);
  //find headings first
  // let result = findHeaders(lines);
  // result.headings = result.headings.map(cleanText);
  // // console.log(obj);
  // lines = result.lines;
  //
  // // console.log(lines);
  let table = [[]];
  // lines.forEach(function(str) {
  //   //end of table, end here
  //   if (str.match(/^\|\}/)) {
  //     return;
  //   }
  //   //this is some kind of comment/summary
  //   if (str.match(/^\|\+/)) {
  //     return;
  //   }
  //   //make new row
  //   if (str.match(/^\|-/)) {
  //     if (table[0].length > 0) {
  //       table.push([]);
  //     }
  //     return;
  //   }
  //   // handle weird '! ' row-header syntax
  //   if (str.match(/^\!/)) {
  //     str = str.replace(/^\! +/, '');
  //     str = cleanText(str);
  //     str = helpers.trim_whitespace(str);
  //     table[table.length - 1].push(str);
  //     return;
  //   }
  //   //juicy line
  //   if (str.match(/^\|/)) {
  //     let want = (str.match(/\|(.*)/) || [])[1] || '';
  //     //handle weird 'rowspan="2" |' syntax
  //     if (want.match(/. \| /)) {
  //       //this needs additional cleanText
  //       want = cleanText(want);
  //     }
  //     want = helpers.trim_whitespace(want) || '';
  //     //handle the || shorthand..
  //     if (want.match(/[!\|]{2}/)) {
  //       want.split(/[!\|]{2}/g).forEach(function(s) {
  //         s = helpers.trim_whitespace(s);
  //         table[table.length - 1].push(s);
  //       });
  //     } else {
  //       table[table.length - 1].push(want);
  //     }
  //   }
  // });
  // //remove top one, if it's empty
  // if (table[0] && Object.keys(table[0]).length === 0) {
  //   table.shift();
  // }
  // //index them by their header
  // table = table.map(arr => {
  //   let obj = {};
  //   arr.forEach((a, i) => {
  //     //clean it up a little bit
  //     a = a.replace(/style=".*?"/, '');
  //     let head = result.headings[i] || 'col-' + i;
  //     obj[head] = parseLine(a);
  //     obj[head] = new Sentence(obj[head]);
  //   });
  //   return obj;
  // });
  return table;
};

module.exports = parseTable;
