const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;
//doc.infoboxes('Venue')

// let doc = fromFile('Bradley-(community),-Lincoln-County,-Wisconsin');
// console.log(doc.citations());

// var str = `{{infobox settlement
// |area_code = [[Area codes 715 and 534|715 & 534]]
// |blank_name = [[Geographic Names Information System|GNIS]] feature ID
// |blank_info = 1562127 {{Coord|57|18|22|N|4|27|32|W|display=title}}
// |year = 1992 {{cite web|url=happyplace.com}}
// }}`;

var str = `
{{Track listing
| headline        = Side one

| all_writing     = [[Lennon–McCartney]], except where noted

| title1          = [[Back in the U.S.S.R.]]
| length1         = 2:43

| title2          = [[Dear Prudence]]
| length2         = 3:56

| title3          = [[Glass Onion]]
| length3         = 2:17

| title4          = [[Ob-La-Di, Ob-La-Da]]
| length4         = 3:08

| title5          = [[Wild Honey Pie]]
| length5         = 0:52

| title6          = [[The Continuing Story of Bungalow Bill]]
| length6         = 3:13

| title7          = [[While My Guitar Gently Weeps]]
| note7           = [[George Harrison]]
| length7         = 4:45

| title8          = [[Happiness Is a Warm Gun]]
| length8         = 2:43
}}`;
var doc = wtf(str);
console.log(doc.templates());
// str = `he is president. {{nowrap|he is {{age|1989|7|23}} years old on {{currentmonth}} {{currentday}} }} he lives in {{currentmonth}} texas`;
// str = `{{infobox Person
// |name={{nowrap|asdfasf}}
// }}`;
// let str = `he is {{height|ft=6}} tall. {{cite web|url=happyplace.com}}`;
// str = `born {{Birth date|1919|12|4|df=yes}}`;
// let doc = wtf(str);
// console.log(doc.plaintext());
// console.log(doc.templates());
// console.log(doc.infoboxes(0).get('blank_info'));
// console.log(doc.citations());

// let str = `{{IMDb title | id= 0426883 | title= Alpha Dog }}`;
// var arr = wtf(str).templates();
// console.log(arr);

// readFile('bluejays').tables(0);
