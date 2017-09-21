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

// var simple = `{| class="wikitable"
// |+ The table's caption
// ! h1
// ! h2
// ! h3
// |-
// ! Row1
// | Cell 1B  || Cell 1C
// |-
// ! Row2
// | Cell 2B
// | Cell 2C
// |}`;

let str = `{| class="wikitable"
|-
! style="text-align:center; {{Baseball primary style|Toronto Blue Jays|border=2}};"|Level
! style="text-align:center; {{Baseball primary style|Toronto Blue Jays|border=2}};"|Team
! style="text-align:center; {{Baseball primary style|Toronto Blue Jays|border=2}};"|League
! style="text-align:center; {{Baseball primary style|Toronto Blue Jays|border=2}};"|Location
|-
| ''AAA''
| [[Buffalo Bisons]]
| [[International League]]
| [[Buffalo, New York|Buffalo]], New York<ref>{{cite web|url=http://buffalonews.com/apps/pbcs.dll/article?AID=/20120917/SPORTS/120919102/1003|title=Herd signs with Blue Jays for two years|last=Harrington|first=Mike|date=17 September 2012|work=[[The Buffalo News]]|accessdate=18 September 2012}}</ref>
|-
| ''AA''
| [[New Hampshire Fisher Cats]]
| [[Eastern League (baseball)|Eastern League]]
| [[Manchester, New Hampshire|Manchester]], New Hampshire
|-
| ''Advanced A''
| [[Dunedin Blue Jays]]
| [[Florida State League]]
| [[Dunedin, Florida|Dunedin]], Florida
|-
| ''A''
| [[Lansing Lugnuts]]
| [[Midwest League]]
| [[Lansing, Michigan|Lansing]], Michigan
|-
|''Short Season A''
| [[Vancouver Canadians]]
| [[Northwest League]]
| [[Vancouver]], British Columbia
|-
|''Rookie-Advanced''
| [[Bluefield Blue Jays]]
| [[Appalachian League]]
| [[Bluefield micropolitan area|Bluefield]], Virginia/West Virginia<!--The team represents both Bluefields. Its park is physically located in Virginia, although the park is operated by the West Virginia city.-->
|-
|rowspan=2|''Rookie''
| [[Gulf Coast League Blue Jays|GCL Blue Jays]]
| [[Gulf Coast League]]
| Dunedin, Florida
|-
| [[Dominican Summer League Blue Jays|DSL Blue Jays]]
| [[Dominican Summer League]]
| [[San Pedro de Macorís]], [[Dominican Republic]]
|}`;
let obj = wtf.parse(str);
let table = obj.sections[0].tables[0];
console.log(table);
