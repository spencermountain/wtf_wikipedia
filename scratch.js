const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`United Kingdom`, 'en');
//   console.log('|' + doc.latex(options) + '|');
// })();


// let doc = readFile('toronto');
// console.log(doc.infobox(0).data);

// var doc = readFile('royal_cinema');
// console.log(doc.section(0));

let str = `{{Harvnb|Selin|2008|p=}}{{cite web|url=https://www.thestar.com/news/city_hall/toronto2014election/2014/10/25/mayoral_candidate_john_tory_a_leader_from_childhood.html|title=Mayoral candidate John Tory a leader from childhood|newspaper=Toronto Star|date=October 25, 2014|first=Linda|last=Diebel|accessdate=October 28, 2014}}</ref>`;
//
var doc = wtf(str);
console.log(doc.citations());
