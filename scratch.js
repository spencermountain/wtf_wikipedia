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
let str = `{| class="wikitable" align="center"
| fun
| cool
|}
`;
// str = `<chem>{C_mathit{x}H_mathit{y}} + mathit{z}O2 -> {mathit{x}CO2} +rac{mathit{y}}{2}H2O</chem> `;
// str = `{{chem|link=oxygen|O|2}} `;

str = `{{chem2|CH3(CH2)5CH3}}`;

let doc = wtf(str);
console.log(doc.text());
console.log(doc.templates());
// console.log(doc.links(0));
