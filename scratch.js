const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')

// let doc = fromFile('Bradley-(community),-Lincoln-County,-Wisconsin');
// console.log(doc.citations());

var str = `{{infobox settlement
|area_code = [[Area codes 715 and 534|715 & 534]]
|blank_name = [[Geographic Names Information System|GNIS]] feature ID
|blank_info = 1562127 {{Coord|57|18|22|N|4|27|32|W|display=title}}
}}`;
// {{nowrap|asdfasf}}
str = `he is {{height|m=1.77|precision=0}}`;
let doc = wtf(str);
console.log(doc.plaintext());
console.log(doc.templates(0).data);
// console.log(doc.infoboxes(0).get('blank_info'));
// console.log(doc.citations());

// let str = `{{IMDb title | id= 0426883 | title= Alpha Dog }}`;
// var arr = wtf(str).templates();
// console.log(arr);
