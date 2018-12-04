const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// Queen consort of Saxony
// Emery Schaub
// Queen consort of the West Franks
// Queen consort of the East Franks

function isCyclic (json) {
  var seenObjects = [];
  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log(obj, 'cycle at ' + key);
          return true;
        }
      }
    }
    return false;
  }
  return detect(json);
}

let arr = [1, 2, 3];
let data = [{
  a: 5,
  c: {
    // a: arr,
    d: 34
  }
}, {
  arr: arr
}];
console.log(isCyclic(data));

// (async () => {
//   var doc = await wtf.fetch('2009–10 Miami Heat season');
//   // var doc = await wtf.random();
//   let data = doc.json({
//     encode: true
//   });
//   console.log(doc.title());
//   console.log(data.sections[5]);
// // console.log(isCyclic(data.sections));
// // let list = await wtf.category('National Basketball Association teams');
// // let list = await wtf.category(856891);
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// let str = `
// {{player||USA|[[Ron Rothstein]]}}
// `;
// let doc = wtf(str);
// let data = doc.json({
//   encode: true
// });
// console.log(data.sections[0]);
// console.log(doc.templates(0));
// console.log(isCyclic(data));
// console.log(wtf(str).text());
// console.log(wtf(str).templates());
// console.log(wtf(str).tables(0).keyValue());
