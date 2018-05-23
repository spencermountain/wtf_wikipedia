const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// var str = `{{tag|ref|content=haha}}`;
// var str=`{{Sfn|Tattersall|1982|pp=43–46}}`
// var str = `{{MSW3 | id = 13801049 | pages = 391–393 | heading = Genus ''Nycteris'' | author = Simmons, N. B.}}`;
var str = `{{Buddhist crisis|state=collapsed}}`;
var str = `{{Lacking ISBN|date=January 2017}}`;
// var str = `The ring-tailed lemur is known locally in Malagasy as ''{{lang|mg|maky}}'' (pronounced {{IPA-mg|ˈmakʲi̥|}}), `;
// var str = `{{s-ttl | title = Member of the [[List of United States Representatives from Massachusetts|House of Representatives]] <br /> from [[Massachusetts's 11th congressional district]] | years = 1947–1953 }}`;
// var doc = wtf(str);
// console.log(doc.plaintext());
// console.log(doc.templates(0));
// var doc = readFile('toronto');


wtf.fetch('John Kennedy').then(doc => {
  console.log(doc.templates().filter(t => t.template !== 'citation'));
});
