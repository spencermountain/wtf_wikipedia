const parseTable = require('./parse');
const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.

//
const findTables = function(section, wiki) {
  let tables = [];
  wiki = wiki.replace(table_reg, (table) => {
    tables.push(parseTable(table));
    return '';
  });

  tables = tables.filter((t) => t && t.length > 0);
  if (tables.length > 0) {
    section.tables = tables;
  }
  return wiki;
};
module.exports = findTables;
