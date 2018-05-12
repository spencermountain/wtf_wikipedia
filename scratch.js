const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')
// let doc = fromFile('royal_cinema');

// let str = `{{foo |last1= hello [[link|text]] |choo=one}}`;
var str = `{{citation |url=cool.com/?fun=yes/   }}`;
var arr = wtf(str).citations();
console.log(arr[0].url.text());
// var str = `{{CITE book |title=the killer and the cartoons }}`;
// console.log(wtf(str).templates('tracklist'));
