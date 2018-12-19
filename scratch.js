const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2010_Toronto_Blue_Jays_season');
//   // var doc = await wtf.random();
//   console.log(doc.sections('regular season').json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


let str = `
== Game log ==
{{MLB Game log month|month=April|style={{baseball secondary style|Toronto Blue Jays}}|hide=y}}
|- style="background:#bbffbb"
| 1 || April 2 || @ [[Detroit Tigers|Tigers]] || 5 – 3 {{small|(10)}} || '''[[Jason Frasor|Frasor]]''' (1-0) || [[Fernando Rodney|Rodney]] (0-1) || '''[[B. J. Ryan|Ryan]]''' (1) || 44,297 || 1-0
|- style="background:#ffbbbb"
| 2 || April 4 || @ [[Detroit Tigers|Tigers]] || 10 – 9 || [[Nate Robertson|Robertson]] (1-0) || '''[[A. J. Burnett|Burnett]]''' (0-1) || [[Todd Jones|Jones]] (1) || 24,881 || 1-1
|- style="background:#bbbbbb"
| -- || April 5 || @ [[Detroit Tigers|Tigers]] || colspan=6|''Postponed (cold weather)'' {{small|Rescheduled for September 10}}
|- style="background:#ffbbbb"
| 22 || April 27 || [[Texas Rangers (baseball)|Rangers]] || 5 – 3 || [[Robinson Tejeda|Tejeda]] (3-1) || '''[[Josh Towers|Towers]]''' (1-3) || [[Akinori Otsuka|Otsuka]] (3) || 24,795 || 11-11
|- style="background:#ffbbbb"
| 23 || April 28 || [[Texas Rangers (baseball)|Rangers]] || 9 – 8 {{small|(10)}} || [[Akinori Otsuka|Otsuka]] (1-0) || '''[[Brian Tallet|Tallet]]''' (0-1) || [[Joaquín Benoit|Benoit]] (1) || 24,119 || 11-12
|- style="background:#bbffbb"
| 24 || April 29 || [[Texas Rangers (baseball)|Rangers]] || 7 – 3 || '''[[Tomo Ohka|Ohka]]''' (2-2) || [[Brandon McCarthy|McCarthy]] (1-4) || || 27,516 || 12-12
|- style="background:#bbffbb"
| 25 || April 30 || [[Texas Rangers (baseball)|Rangers]] || 6 – 1 || '''[[Roy Halladay|Halladay]]''' (4-0) || [[Vicente Padilla|Padilla]] (0-4) || || 19,041 || 13-12
{{MLB Game log month end}}`;
let doc = wtf(str);
console.log(doc.templates(0));
// // console.log(wtf(str).templates(0));
// console.log(doc.links());
// Alan Bean marriage template
