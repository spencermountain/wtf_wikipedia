const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  const document = await wtf.fetch('Formel 1', 'de');

  console.log(document.section('Länderbezug').sentences(4).plaintext());
})();

// let str = `hello
// [[Datei:Formula 1 all over the world-2018.svg|mini|hochkant=2|center|[[Liste der Formel-1-Rennstrecken|Länder, die einen Grand Prix austrugen]]
// ]] world
//  `;
// console.log(wtf(str).text());
// console.log(wtf(str).images());
