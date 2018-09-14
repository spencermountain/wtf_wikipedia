const parseTable = require('./parseTable');
const Table = require('./Table');
// const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.
const openReg = /^\s*{\|/;
const closeReg = /^\s*\|}/;

//tables can be recursive, so looky-here.
const findTables = function(section, wiki) {
  let list = [];
  let lines = wiki.split('\n');
  let stack = [];
  for (let i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i]);
      continue;
    }
    //close a table
    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i];
      let table = stack.pop();
      list.push(table);
      continue;
    }
    //keep-going on one
    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i];
    }
  }
  //work-em together for a Table class
  let tables = [];
  list.forEach(str => {
    if (str) {
      //also reremove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '');
      wiki = wiki.replace(str, '');
      let data = parseTable(str);
      if (data && data.length > 0) {
        tables.push(new Table(data));
      }
    }
  });

  if (tables.length > 0) {
    section.tables = tables;
  }
  return wiki;
};

module.exports = findTables;
