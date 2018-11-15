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
| style="background: gray;"      | <math>x^2</math>
| style="background: Goldenrod;" | <math>y^3</math>
|}
`;
str = `{{chem|link=oxygen|O|2}} `;
str = `<chem>{C_mathit{x}H_mathit{y}} + mathit{z}O2 -> {mathit{x}CO2} +rac{mathit{y}}{2}H2O</chem> `;



let doc = wtf(str);
console.log(doc.text());
console.log(doc.templates());
// console.log(doc.links(0));
