'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  // console.log(wtf.plaintext(str));
  let r = wtf.parse(str);
  console.log(r.translations);
  // console.log(JSON.stringify(r.sections, null, 2));
}

// from_file("list")
// from_file("earthquakes");
// from_file("bluejays");
// from_file('Toronto');
// from_file('Toronto_Star');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('Anarchism');

wtf.from_api('Radiohead', 'en', function(markup) {
  var obj = wtf.parse(markup);
  console.log(obj.infoboxes);
});

// {
//   type:'', //'page'/redirect/category/template
//   infoboxes:[], //parsed key-value for each infobox template
//   categories:[], //list of parsed categories
//   interwiki:{},
//   sections:[{
//       title:'',
//       images:'',
//       lists:'',
//     }]
// }
// var str = 'hello [[wikinews:Radiohead]] world  [[Category:Films]]';
// console.log(wtf.parse(str));
