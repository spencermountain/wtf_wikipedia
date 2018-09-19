const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`United Kingdom`, 'en');
//   console.log('|' + doc.latex(options) + '|');
// })();


// let doc = readFile('toronto');
// console.log(doc.infobox(0).data);

// let doc = wtf(`[[File:King Cotton.jpg |right |thumb |upright=1.9 |Panoramic photograph of a cotton plantation from 1907, titled "King Cotton".]]
// "'''King Cotton'''" is a slogan which summarized the strategy `);
// console.log(doc.images(0).data);

let str = `{{Infobox museum
|coordinates = {{coord|41.893269|-87.622511|display=inline}}
|image=           20070701 Arts Club of Chicago.JPG
|website= [http://www.artsclubchicago.org www.artsclubchicago.org]
}}
'''Arts Club of Chicago''' is a private club located in the [[Near North Side, Chicago|Near North Side]] `;

var doc = wtf(str);
console.log(doc.citations(0).json());
