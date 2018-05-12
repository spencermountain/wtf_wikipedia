const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')
// let doc = fromFile('royal_cinema');
// var str = `Emery is a vegetarian, {{ cite web|foo =    bar| url=http://cool.com/?fun=cool/}}`;
// wtf(str).templates();

var str = `hello {{cite book |title=fun times }} {{cite book |title=the killer and the cartoons }}`;
var arr = wtf(str, {
  citations: false
}).citations();
console.log(arr);
