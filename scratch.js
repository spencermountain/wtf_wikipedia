const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('Little Butte Creek', 'en');
//   console.log(doc.json());
// })();

// let doc = readFile('Mark-Behr');
// console.log(doc.infobox(0).data);

var str = ` {{cite gnis|id=1145117|name=Little Butte Creek|entrydate=November 28, 1980|accessdate=September 26, 2009}}
* {{cite journal|url=https://nrimp.dfw.state.or.us/web%20stores/data%20libraries/files/Watershed%20Councils/Watershed%20Councils_311_DOC_200-041Assess.zip|format=[[Zip (file format)|ZIP]]|publisher=Little Butte Creek Watershed Council|title=Little Butte Creek Watershed Assessment|date=August 2003|accessdate=September 20, 2009|}}
`;
console.log(wtf(str).references());
