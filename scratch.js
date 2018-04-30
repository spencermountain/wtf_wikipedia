'use strict';
const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('royal_cinema');
// let doc = fromFile('toronto');
// console.log(doc.sections('Infrastructure').json());
// // wtf.fetch('Royal Cinema').then((doc) => {
// //   console.log(doc.json({
// //     categories: false
// //   }));
// // }).catch(console.log);

let wiki = `{{Infobox church
| name                   = Ávila Cathedral&lt;br /&gt; Catedral del Salvador de Ávila
| image                  = Ávila Chatedral main view.jpg
| imagesize              = 180px
| caption                = Ávila Cathedral
| location               = [[Ávila]], [[Spain]]
| country                = Spain
| denomination           = [[Roman Catholicism]]
| founder                = Siglo XI - Siglo XV
| style                  = [[Gothic architecture|Gothic ]], [[Romanesque architecture|Romanesque]]
}}

[[File:|180px|right]]
The '''Cathedral of Ávila''' is a [[Romanesque architecture|Romanesque]] and [[Gothic Architecture|Gothic]] church. It is in [[Ávila, Spain|Ávila]]. It is just south of [[Old Castile]], [[Spain]]. It also has a [[cemetery]]. It was built in 1475.

The Cathedral of Ávila was one of 100 finalists for the [[12 Treasures of Spain]] in 2007.&lt;ref&gt;{{cite web|url=http://sobreturismo.es/2007/11/27/lista-de-100-finalistas-de-nuestros-12-tesoros-de-espana/ |title=Lista de 100 finalistas de Nuestros 12 Tesoros de España |publisher=Sobreturismo.es |date=2007-11-27 |accessdate=2014-10-06}}&lt;/ref&gt;

==References==
{{reflist}}

{{DEFAULTSORT:Avila Cathedral}}
[[Category:Cathedrals in Spain]]


{{multistub|Europe|religion}}
`;
console.log(wtf(wiki).json({
  images: true
}));
