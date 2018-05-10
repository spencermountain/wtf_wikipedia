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
// console.log(doc.sections());
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

// {{Tracklist
// | collapsed       =
// | headline        = Track list
// | extra_column    = Artist(s)
// | total_length    = 23:14
// | all_lyrics      = [[Ramajogayya Sastry]], except where noted
// | music_credits   =
// | title1          = Rama Rama
// | extra1          = [[Sooraj Santhosh]], [[Ranina Reddy]]
// | length1         = 4:20
// | title2          = Jatha Kalise
// | extra2          = Sagar, [[Suchitra]]
// | length2         = 3:44
// | title3          = Charuseela
// | note3           = Co-written by [[Devi Sri Prasad]]
// | extra3          = Yazin Nizar, Devi Sri Prasad (Rap)
// | length3         = 4:15
// | title4          = Srimanthuda
// | extra4          = [[M. L. R. Karthikeyan]]
// | length4         = 2:03
// | title5          = Jaago
// | extra5          = [[Raghu Dixit]], [[Rita (Indian singer)|Rita]]
// | length5         = 4:11
// | title6          = Dhimmathirigae
// | extra6          = Simha, [[Geetha Madhuri]]
// | length6         = 4:41
// }}

let wiki = `
[[File:War.png]]
intro bit
==History==
this is the [[second]] section.<ref>[http://coolyeah.yes fun times]</ref>

this is the second paragraph. woo hoo.
==Discography==
{{main|lkjsf}}
hello

hellow world`;
console.log(wtf(wiki).citations());
