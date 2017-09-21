'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  // console.log(wtf.plaintext(str));
  let r = wtf.parse(str);
  console.log(r.infoboxes[0]);
  // console.log(JSON.stringify(r.sections, null, 2));
}

// from_file('list');
// from_file("earthquakes");
// from_file('bluejays');
// from_file('redirect');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Toronto_Star');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('rnli_stations');

// wtf.from_api('Radiohead', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj.infoboxes[0].data);
//   // console.log(wtf.plaintext(markup));
// });

// {
//   type: '', //page/redirect/category/template
//   infoboxes: [{
//     template: '', //template name
//     data: {} //key-value data
//   }],
//   categories: [], //parsed categories
//   images: [], //image files + their md5 urls
//   interwiki: {},
//   sections: [{ //each heading
//       title: '',
//       images: '',
//       lists: '',
//       tables: '',
//       sentences: [{ //each sentence
//         text: ''
//         links: [{
//           text: '',
//           link: '' //(if different)
//         }]
//       }]
//     }]
// }

var str = `{| class="wikitable"
|+ style="text-align: left;" | Data reported for 2014–2015, by region<ref name="Garcia 2005" />
|-
! scope="col" | Year !! scope="col" | Africa !! scope="col" | Americas !! scope="col" | Asia & Pacific !! scope="col" | Europe
|-
! scope="row" | 2014
| 2,300 || 8,950 || ''9,325'' || 4,200
|-
! scope="row" | 2015
| 2,725 || ''9,200'' || 8,850 || 4,775
|}`;

let obj = wtf.parse(str);
let table = obj.sections[0].tables[0];
console.log(table);
