const helpers = require('../lib/helpers');
const table_reg = /\{\|[\s\S]{1,8000}?\|\}/g;

//turn a {|...table string into an array of arrays
const parse_table = function(wiki) {
  let table = [];
  const lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function(str) {
    //die here
    if (str.match(/^\|\}/)) {
      return;
    }
    //make new row
    if (str.match(/^\|-/)) {
      table.push([]);
      return;
    }
    //this is some kind of comment
    if (str.match(/^\|\+/)) {
      return;
    }
    //juicy line
    if (str.match(/^[\!\|]/)) {
      //make a new row
      if (!table[table.length - 1]) {
        table[table.length - 1] = [];
      }
      let want = (str.match(/\|(.*)/) || [])[1] || '';
      want = helpers.trim_whitespace(want) || '';
      //handle the || shorthand..
      if (want.match(/[!\|]{2}/)) {
        want.split(/[!\|]{2}/g).forEach(function(s) {
          s = helpers.trim_whitespace(s);
          table[table.length - 1].push(s);
        });
      } else {
        table[table.length - 1].push(want);
      }
    }
  });
  return table;
};

const findTables = function(r, wiki) {
  r.tables = wiki.match(table_reg, '') || [];
  r.tables = r.tables.map(function(str) {
    return parse_table(str);
  });
  //remove tables
  wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '');
  return wiki;
};
module.exports = findTables;
