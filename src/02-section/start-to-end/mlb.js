const tableParser = require('../table/parse');
let headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record'];
//https://en.wikipedia.org/wiki/Template:MLB_game_log_section


const parseMlb = function(wiki, section) {
  wiki = wiki.replace(/\{\{mlb game log section[\s\S]+?\{\{mlb game log section end\}\}/gi, (tmpl) => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{mlb game log section end\}\}/i, '');
    let headers = '! ' + headings.join(' !! ');
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    let rows = tableParser(table);
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text();
      });
      return row;
    });
    section.templates.push({
      template: 'mlb game log section',
      data: rows
    });
    return '';
  });
  return wiki;
};
module.exports = parseMlb;
