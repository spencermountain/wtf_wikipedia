const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('List of Harvard Crimson men\'s ice hockey seasons');
//   // var doc = await wtf.random();
//   console.log(doc.text());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


let str = `
{| class="toccolours collapsible"  style="width:90%; clear:both; margin:1.5em auto; text-align:center;"
|- style="text-align:center;"
 colspan=11 style=background:#005ac0; color:white;" | April
|-  style="text-align:center; background:black;"
| '''<span style="color:silver;">#</span>''' || '''<span style="color:silver;">Date</span>''' || '''<span style="color:silver;">Opponent</span>''' || '''<span style="color:silver;">Score</span>''' || '''<span style="color:silver;">Win</span>''' || '''<span style="color:silver;">Loss</span>''' || '''<span style="color:silver;">Save</span>''' || '''<span style="color:silver;">Attendance</span>''' || '''<span style="color:silver;">Record</span>'''|| '''<span style="color:silver;">GB</span>'''
|-  style="text-align:center; background:#fbb;"
| 1 || April 5 || @ [[Texas Rangers (baseball)|Rangers]] || 5–4 || [[Frank Francisco|Francisco]] (1–0) || '''[[Jason Frasor|Frasor]]''' (0–1) || || 50,299 || 0–1 || 1
|-  style="text-align:center; background:#cfc;"
| 2 || April 7 || @ [[Texas Rangers (baseball)|Rangers]] || 7–4 || '''[[Brian Tallet|Tallet]]''' (1–0) || [[Dustin Nippert|Nippert]] (0–1) || '''[[Jason Frasor|Frasor]]''' (1) || 22,890 || 1–1 || 1
|-  style="text-align:center; background:#cfc;"
| 3 || April 8 || @ [[Texas Rangers (baseball)|Rangers]] || 3–1 || '''[[Casey Janssen|Janssen]]''' (1–0) || [[Frank Francisco|Francisco]] (1–1) || '''[[Jason Frasor|Frasor]]''' (2) || 14,707 || 2–1 || —
|-  style="text-align:center; background:#cfc;"
| 4 || April 9 || @ [[Baltimore Orioles|Orioles]] || 7–6 || '''[[Casey Janssen|Janssen]]''' (2–0) || [[Mike Gonzalez|Gonzalez]] (0–2) || '''[[Kevin Gregg|Gregg]]''' (1) || 48,891 || 3–1 || —
|-  style="text-align:center; background:#cfc;"
|}`;
let doc = wtf(str);
console.log(doc.tables(0).json());
// // console.log(wtf(str).templates(0));
// console.log(doc.links());
// Alan Bean marriage template
