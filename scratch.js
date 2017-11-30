'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  let r = wtf.parse(str);
  console.log(r.citations);
  return r;
}
// from_file('list');
// from_file("earthquakes");
// from_file('al_Haytham');
// from_file('redirect');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Toronto_Star');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('rnli_stations');
//Ibn al-Haytham
wtf.from_api('Love You More (Ginuwine song)', 'en', function(markup) {
  var obj = wtf.parse(markup);
  console.log(obj);
});

// var str = `in 1826.<ref name="brake">Brake (2009)</ref>  `;
// console.log(wtf.parse(str).citations);
