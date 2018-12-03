const tableParser = require('../table/parse');

const keys = {
  coach: [
    'Team',
    'Year',
    'G',
    'W',
    'L',
    'W-L%',
    'Finish',
    'PG',
    'PW',
    'PL',
    'PW-L%'
  ],
  player: [
    'Year',
    'Team',
    'GP',
    'GS',
    'MPG',
    'FG%',
    '3P%',
    'FT%',
    'RPG',
    'APG',
    'SPG',
    'BPG',
    'PPG',
  ],
  roster: [
    'Player',
    'GP',
    'GS',
    'MPG',
    'FG%',
    '3FG%',
    'FT%',
    'RPG',
    'APG',
    'SPG',
    'BPG',
    'PPG'
  ],
};

//https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start
const parseNBA = function(wiki, section) {
  wiki = wiki.replace(/\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi, (tmpl, name) => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{s-end\}\}/, '');
    name = name.toLowerCase().trim();
    let headers = '! ' + keys[name].join(' !! ');
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    let rows = tableParser(table);

    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text();
      });
      return row;
    });
    section.templates.push({
      template: 'NBA ' + name + ' statistics',
      data: rows
    });
    return '';
  });
  return wiki;
};
module.exports = parseNBA;
