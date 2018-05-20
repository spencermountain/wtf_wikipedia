const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')

// let doc = fromFile('Bradley-(community),-Lincoln-County,-Wisconsin');
// console.log(doc.citations());

var str = `{{infobox settlement
|blank_name = [[Geographic Names Information System|GNIS]] feature ID
|blank_info = 1562127<ref>{{cite gnis|na=1562127|Bradley}}</ref>
}}
`;
let doc = wtf(str);
// console.log(doc.plaintext());
console.log(doc.templates());
// console.log(doc.infoboxes(0).get('blank_info'));
// console.log(doc.citations());

// let str = `{{IMDb title | id= 0426883 | title= Alpha Dog }}`;
// var arr = wtf(str).templates();
// console.log(arr);

// readFile('bluejays').tables(0);
