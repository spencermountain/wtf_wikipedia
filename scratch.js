'use strict';
const wtf = require('./src/index');
// const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//  "Susan Allen (May 10, 1951 &amp;ndash; September 7, 2015) was an American harpist...."
// ""Nils Daniel Carl Bildt, born born 15 July 1949 in Halmstad, Sweden, is a Swedish politician and diplomat who was Prime Minister of Sweden from 1991 to 1994.&lt;ref&gt;&lt..."
// "'''Toronto''' ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the [[List of the 100 largest municipalities in Canada by population|most populous city]] in [[Canada]] and the [[Provinces and territories of Canada|provincial]] [[capital city|capital]] of [[Ontario]]. "
// " '''Andriy Mykolayovych Vasylytchuk''' ({{lang-uk|Андрій Миколайович Василитчук}}; {{lang-ru|Андрей Николаевич Василитчук}}; born 23 October 1965 in [[Lviv]]) is a retired [[Ukraine|Ukrainian]] professional [[Association football|football]]er."
// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('royal_cinema');
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

let wiki = `
The '''Lot''' ({{lang-oc|Olt}}) is a river in southern [[France]], tributary of the [[Garonne river]]. The [[Lot (department)|Lot]] department is named after this river.

==Geography==
The Lot river has a length of {{Convert|290.7|km|mi|1|abbr=on}} and a [[drainage basin]] with an area of {{Convert|11400|km2|sqmi|0|abbr=on }}.<ref name="sandre">{{cite web |url=http://services.sandre.eaufrance.fr/Courdo/Fiche/client/fiche_courdo.php?CdSandre=O---0150 |title=Le Lot (O---0150) |publisher=SANDRE - Portail national d'accès aux référentiels sur l'eau |language=French |accessdate=22 May 2014 |date= }}</ref>

Its average yearly [[Discharge (hydrology)|discharge]] ([[volume]] of [[water]] which passes through a section of the river per [[Unit of measurement|unit]] of [[time]]) is 155 [[cubic metre]]s per [[second]] at [[Villeneuve-sur-Lot]].<ref>{{cite web |url=http://www.hydro.eaufrance.fr/stations/O8481520&procedure=synthese |title=Le Lot à Villeneuve-sur-Lot |publisher=Banque Hydro |language=French |accessdate=22 May 2014 |date= }}</ref>

[[Category:Rivers of France]]
[[Category:Occitanie]]
[[Category:Auvergne-Rhône-Alpes]]
[[Category:Nouvelle-Aquitaine]]
`;
console.log(wtf(wiki).plaintext());
