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

var str = `{| class="wikitable floatright"
| Col 1, row 1
| rowspan="2" | Col 2, row 1 (and 2)
| Col 3, row 1
|-
| Col 1, row 2
| Col 3, row 2
|}
{| class="wikitable floatleft"
| Col 1, row 1
| rowspan="2" | Col 2, row 1 (and 2)
| Col 3, row 1
|-
| Col 1, row 2
| Col 3, row 2
|}`;

let obj = wtf.parse(str);
let table = obj.sections[0].tables[0];
console.log(table);
