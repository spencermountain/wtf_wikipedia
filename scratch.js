const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());

let str = `
==Player statistics==
{{NBA roster statistics legend}}

;Cleveland Cavaliers
{{NBA roster statistics start|team=Cleveland Cavaliers}}
|-
| style="text-align:left;"| {{sortname|Matthew|Dellavedova}} || 6 || 0 || 7.6 || .263 || .167 || .833 || 0.5 || 1.0 || 0.0 || 0.0 || 2.7
|-
| style="text-align:left;"| {{sortname|Channing|Frye}} || 4 || 0 || 8.3 || .000 || .000 || '''1.000''' || 0.8 || 0.0 || 0.0 || 0.5 || 0.5
|-
| style="text-align:left;"| {{sortname|Kyrie|Irving}} || 7 || 7 || 39.0 || .468 || '''.405''' || .939 || 3.9 || 3.9 || 2.1 || 0.7 || 27.1
|-! style="background:#FDE910;"
| style="text-align:left;"| {{sortname|LeBron|James}} || 7 || 7 || '''41.7''' || .494 || .371 || .721 || '''11.3''' || '''8.9''' || '''2.6''' || '''2.3''' || '''29.7'''
|-
| style="text-align:left;"| {{sortname|Richard|Jefferson}} || 7 || 2 || 24.0 || .516 || .167 || .636 || 5.3 || 0.4 || 1.3 || 0.1 || 5.7
|-
| style="text-align:left;"| {{sortname|Dahntay|Jones}} || 6 || 0 || 3.0 || .500 || .000 || .800 || 0.3 || 0.0 || 0.0 || 0.2 || 1.3
|-
| style="text-align:left;"| {{sortname|James|Jones|dab=basketball player}} || 5 || 0 || 4.0 || .000 || .000 || .250 || 0.4 || 0.4 || 0.0 || 0.0 || 0.2
|-
| style="text-align:left;"| {{sortname|Kevin|Love}} || 6 || 5 || 26.3 || .362 || .263 || .706 || 6.8 || 1.3 || 0.7 || 0.3 || 8.5
|-
| style="text-align:left;"| {{sortname|Jordan|McRae}} || 1 || 0 || 3.0 || '''1.000''' || .000 || .000 || 1.0 || 0.0 || 0.0 || 0.0 || 4.0
|-
| style="text-align:left;"| {{sortname|Timofey|Mozgov}} || 5 || 0 || 5.0 || .333 || .000 || .750 || 1.6 || 0.0 || 0.6 || 0.2 || 1.4
|-
| style="text-align:left;"| {{sortname|Iman|Shumpert}} || 7 || 0 || 18.3 || .304 || .267 || '''1.000''' || 1.6 || 0.1 || 0.1 || 0.3 || 3.0
|-
| style="text-align:left;"| {{sortname|J. R.|Smith}} || 7 || 7 || 37.3 || .400 || .356 || .667 || 2.7 || 1.6 || 1.4 || 0.3 || 10.6
|-
| style="text-align:left;"| {{sortname|Tristan|Thompson}} || 7 || 7 || 32.3 || .636 || .000 || .533 || 10.1 || 0.7 || 0.3 || 0.9 || 10.3
|-
| style="text-align:left;"| {{sortname|Mo|Williams}} || 6 || 0 || 4.8 || .333 || .200 || .000 || 0.5 || 0.2 || 0.5 || 0.0 || 1.5
{{s-end}}`;
let doc = wtf(str);
console.log(doc.plaintext());

// wtf.random('de').then(doc => console.log(doc.title()));
