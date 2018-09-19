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

let doc = wtf(`[[File:King Cotton.jpg |right |thumb |upright=1.9 |Panoramic photograph of a cotton plantation from 1907, titled "King Cotton".]]
"'''King Cotton'''" is a slogan which summarized the strategy `);
console.log(doc.images(0).json());

// let str=`{{climate chart
// | Toronto
// | −6.7 | -0.7 | 62
// | −5.6 |  0.4 | 55
// | −1.9 |  4.7 | 54
// |  4.1 | 11.5 | 68
// |  9.9 | 18.4 | 82
// | 14.9 | 23.9 | 71
// | 18.0 | 26.6 | 64
// | 17.4 | 25.5 | 81
// | 13.4 | 21.0 | 85
// |  7.4 | 14.0 | 64
// |  2.3 |  7.5 | 84
// | −3.1 |  2.1 | 61
// |float=right
// |source= Environment Canada }}`
