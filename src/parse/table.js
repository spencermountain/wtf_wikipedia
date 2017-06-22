const helpers = require("../lib/helpers");
const parse_line = require("./text");

const table_reg = /\{\|[\s\S]{1,8000}?\|\}/g;

const parseHeading = function(str) {
  str = str.replace(/^\! +/, "");
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ""); //class="unsortable"|title
  }
  str = parse_line(str).text;
  return str;
};

//turn a {|...table string into an array of arrays
const parse_table = function(wiki) {
  let table = [];
  let headings = [];
  const lines = wiki.replace(/\r/g, "").split(/\n/);

  //find headings first
  for (let i = 0; i < lines.length; i++) {
    let str = lines[i];
    //header
    if (str.match(/^\!/)) {
      str = parseHeading(str);
      if (!str) {
        str = "col-" + headings.length;
      }
      headings.push(str);
    } else if (str.match(/^\| /)) {
      break;
    }
  }

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
    //header
    if (str.match(/^\!/)) {
      return;
    }
    //juicy line
    if (str.match(/^\|/)) {
      //make a new row
      if (!table[table.length - 1]) {
        table[table.length - 1] = [];
      }
      let want = (str.match(/\|(.*)/) || [])[1] || "";
      want = helpers.trim_whitespace(want) || "";
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
      let head = headings[i] || "col-" + i;
      obj[head] = parse_line(a);
    });
    return obj;
  });
  return table;
};

const findTables = function(r, wiki) {
  r.tables = wiki.match(table_reg, "") || [];
  r.tables = r.tables.map(function(str) {
    return parse_table(str);
  });
  //remove tables
  wiki = wiki.replace(table_reg, "");
  return wiki;
};
module.exports = findTables;
