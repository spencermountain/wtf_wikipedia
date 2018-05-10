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


var str = `{{Time ago| Jan 21, 2001 3:45 PM}}`;

// var str = `{{CITE book |title=the killer and the cartoons }}`;
var arr = wtf(str).text();
console.log(arr);
// console.log(wtf(str).templates('tracklist'));
