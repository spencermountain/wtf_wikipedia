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

var str = `{{Collapsible list
 | title = [[European Free Trade Association]] members
 | [[Iceland]]
 | [[Liechtenstein]]
 | [[Norway]]
 | [[Switzerland]]
}}`;
// str = ` {{Collapsible list
//   |framestyle=border:none; padding:0; <!--Hides borders and improves row spacing-->
//   |title=List of MPs
//   |1=[[Dean Allison]] |2=[[Chris Charlton]] |3=[[David Christopherson]] |4=[[Wayne Marston]] |5=[[David Sweet]]
//  }}`;

// str = `hello {{math|big=1|1 + 2 {{=}} 3}} world`;

let doc = wtf(str);
console.log(doc.text());
// console.log(doc.templates(0));
// console.log(doc.links(0));
