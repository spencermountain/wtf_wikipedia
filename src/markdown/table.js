const doSentence = require('./sentence');
const cellWidth = 15;
/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/

//center-pad each cell, to make the table more legible
const pad = (str) => {
  let diff = cellWidth - str.length;
  diff = parseInt(diff / 2, 10);
  for(let i = 0; i < diff; i += 1) {
    str = ' ' + str + ' ';
  }
  return str;
};

const makeRow = (arr) => {
  arr = arr.map(pad);
  return '| ' + arr.join(' | ') + ' |';
};

//markdown tables are weird
const doTable = (table, options) => {
  let md = '';
  if (!table || table.length === 0) {
    return md;
  }
  let keys = Object.keys(table[0]);
  //first, grab the headers
  //remove auto-generated number keys
  let header = keys.map((k, i) => {
    if (parseInt(k, 10) === i) {
      return '';
    }
    return k;
  });
  //draw the header (necessary!)
  md += makeRow(header) + '\n';
  md += makeRow(['---', '---', '---']) + '\n';
  //do each row..
  md += table.map((row) => {
    //each column..
    let arr = keys.map((k) => {
      if (!row[k]) {
        return '';
      }
      return doSentence(row[k], options) || '';
    });
    //make it a nice padded row
    return makeRow(arr);
  }).join('\n');
  return md + '\n';
};
module.exports = doTable;
