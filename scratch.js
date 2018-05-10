'use strict';
const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// `The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]]`
// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('royal_cinema');
// let doc = fromFile('Alanine—oxo-acid-transaminase');
// console.log(doc.citations());
// console.log(doc.sections(2).templates());
// let doc = fromFile('toronto');
// console.log(doc.sentences(0).text());
// console.log(doc.sections('Infrastructure').json());
// // wtf.fetch('Royal Cinema').then((doc) => {
// //   console.log(doc.json({
// //     categories: false
// //   }));
// // }).catch(console.log);

// console.log(wtf(wiki).json({
//   images: true
// }));
// let wiki = `The Lot river has a length of {{Convert|290.7|km|mi|1|abbr=on}} and a [[drainage basin]] with an area of {{Convert|11400|km2|sqmi|0|abbr=on }}.`;
// let wiki = `[[File:{{#Property:P18}}|thumb]]
// '''George C. Papanicolaou''' (born January 23, 1943) is a [[Greece|Greek]]-[[United States|American]] [[mathematician]] who specializes in [[applied mathematics|applied]] and [[computational mathematics]], [[partial differential equation]]s, and [[stochastic process]]es.<ref name="sufac">http://math.stanford.edu/directory/faculty.html</ref> He is currently the Robert Grimmett Professor in Mathematics at [[Stanford University]].
// `;


var str = `
{{Track listing
| headline        = Side one

| all_writing     = [[Lennon–McCartney]], except where noted

| title1          = [[Back in the U.S.S.R.]]
| length1         = 2:43

| title2          = [[Dear Prudence]]
| length2         = 3:56
}}
hello there
`;
str = `
==References==
{{reflist|1}}
* {{cite journal |vauthors=ALTENBERN RA, HOUSEWRIGHT RD | year = 1953 | title = Transaminases in smooth Brucella abortus, strain 19 | journal = J. Biol. Chem.  | volume = 204 | pages = 159&ndash;67  | pmid = 13084587 | issue = 1 | url=http://www.jbc.org/content/204/1/159.full.pdf | format=PDF}}
`;
// var str = `{{CITE book |title=the killer and the cartoons }}`;
var arr = wtf(str).citations();
console.log(arr);
// console.log(wtf(str).templates('tracklist'));
