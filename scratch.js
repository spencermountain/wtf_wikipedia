const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// let p = wtf.fetch('Kurmi', 'en');
// p.then((doc) => {
//   console.log(doc.images());
// }).catch(console.log);


let str = `{{Gallery|width=200 |lines=4
|File:India1909PrevailingRaces.JPG|The map of the prevailing "races" of India (now discredited) based on the 1901 Census of British India. The Kurmi are shown both in the [[United Provinces of Agra and Oudh|United Provinces]] (UP) and the [[Central Provinces]].
|File:Kurmi sowing.jpg|An "ethnographic" photograph from 1916 showing Kurmi farmers, both men and women, sowing a field.
|File:Kurmi threshing.jpg|Another ethnographic print from 1916 showing a Kurmi family employing its beasts of burden to thresh wheat.
|File:Kurmi winnowing.jpg|A third print from the same collection showing the Kurmi family winnowing.
}} `;
console.log(wtf(str).templates());
