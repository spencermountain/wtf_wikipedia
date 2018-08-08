const parseTable = require('./parseTable');
const Table = require('./Table');
const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.

//find all tables '{|..|}' in the document, and parse them
const findTables = function(section, wiki) {
  let tables = [];
  wiki = wiki.replace(table_reg, (str) => {
    let data = parseTable(str);
    if (data && data.length > 0) {
      let table = new Table(data);
      tables.push(table);
    }
    return '';
  });
  if (tables.length > 0) {
    section.tables = tables;
  }
  return wiki;
};
module.exports = findTables;
