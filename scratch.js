const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// const doc = await wtf.fetch('Berlin', 'de');
// console.log(doc.sentences(0).plaintext());
// })();

var doc=wtf(`hello

<gallery>
 Culex-female.jpg|Stechmücke
 Black Fly.png|Kriebelmücke
 Culicoides-imicola-bloodfeeding.jpg|Gnitzen
 Tipula oleracea female (Linnaeus 1758).jpg|Schnake
 Chironomus plumosus01.jpg|Zuckmücke
 Psychodidae.jpg|Schmetterlingsmücke
 Fly February 2009-2.jpg|Haarmücke
 Sciara_analis_de.jpg|Trauermücke
</gallery>

foo`)

// doc=wtf(`hello
//
//   <gallery>
//   File:Freya (1901) by Anders Zorn.jpg|''[[Freyja|Freya]]'', 1901
//   File:ZORN på sandhamn.jpg|Woman bathing at Sandhamn, 1906
//   File:Anders Zorn I werners eka-1917.jpg|Woman in a boat, 1917
//   File:Anders Zorn - I Sängkammaren.jpg|''In the bedroom'', 1918
//   File:Anders Zorn - Ateljéidyll.jpg|G''Studio Idyll'', 1918
//   </gallery>
//
// foo`)
console.log(doc.templates(0))
//should return "Fileaway"; actually returns "away"
