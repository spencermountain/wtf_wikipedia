const helpers = require('../../lib/helpers');
const parseLine = require('./sentence/').parseLine;

const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.

const parseHeading = function(str) {
  str = parseLine(str).text || '';
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  return str;
};

//turn a {|...table string into an array of arrays
const parse_table = function(wiki) {
  let headings = [];
  let lines = wiki.replace(/\r/g, '').split(/\n/);

  //find headings first
  for (let i = 0; i < lines.length; i++) {
    let str = lines[i];
    //header
    if (str.match(/^\!/)) {
      str = str.replace(/^\! +/, '');
      //handle inline '!!' format
      if (str.match(/ \!\! /)) {
        let heads = str.split(/ \!\! /);
        headings = heads.map(parseHeading);
      } else {
        //handle heading-per-line
        str = parseHeading(str);
        if (!str) {
          str = 'col-' + headings.length;
        }
        headings.push(str);
        lines[i] = null; //remove it
      }
    } else if (headings.length > 0 && str.match(/^|-/)) {
      lines = lines.slice(i, lines.length);
      break; //done here
    } else if (str.match(/^\| /)) {
      lines = lines.slice(i, lines.length);
      break; //done here
    }
  }
  lines = lines.filter(l => l);

  // console.log(lines);
  let table = [[]];
  lines.forEach(function(str) {
    //end of table, end here
    if (str.match(/^\|\}/)) {
      return;
    }
    //this is some kind of comment/summary
    if (str.match(/^\|\+/)) {
      return;
    }
    //make new row
    if (str.match(/^\|-/)) {
      if (table[0].length > 0) {
        table.push([]);
      }
      return;
    }
    // handle weird '! ' row-header syntax
    if (str.match(/^\!/)) {
      str = str.replace(/^\! +/, '');
      str = parseHeading(str);
      str = helpers.trim_whitespace(str);
      table[table.length - 1].push(str);
      return;
    }
    //juicy line
    if (str.match(/^\|/)) {
      let want = (str.match(/\|(.*)/) || [])[1] || '';
      //handle weird 'rowspan="2" |' syntax
      if (want.match(/. \| /)) {
        //this needs additional cleanup
        want = parseHeading(want);
      }
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
  //remove top one, if it's empty
  if (table[0] && Object.keys(table[0]).length === 0) {
    table.shift();
  }
  //index them by their header
  table = table.map(arr => {
    let obj = {};
    arr.forEach((a, i) => {
      let head = headings[i] || 'col-' + i;
      obj[head] = parseLine(a);
    });
    return obj;
  });
  return table;
};

const findTables = function(r, wiki) {
  let tables = wiki.match(table_reg, '') || [];
  tables = tables.map(function(str) {
    return parse_table(str);
  });
  tables = tables.filter((t) => t && t.length > 0);
  if (tables.length > 0) {
    r.tables = tables;
  }
  //remove tables
  wiki = wiki.replace(table_reg, '');
  return wiki;
};
module.exports = findTables;
