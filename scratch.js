const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('Jurassic Park (film)');
// var doc = await wtf.random();
// let list = await wtf.category('National Basketball Association teams');
// let list = await wtf.category(856891);
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());

let str = `

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
| style="text-align:left;"| {{sortname|Mo|Williams}} || 6 || 0 || 4.8 || .333 || .200 || .000 || 0.5 || 0.2 || 0.5 || 0.0 || 1.5
{{s-end}}`;

str = '{{NBA roster statistics legend}}';
let doc = wtf(str);
console.log('\n\n-----');
console.log(doc.text());
console.log(doc.templates());
