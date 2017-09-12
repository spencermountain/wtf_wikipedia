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
var str = `{{Infobox football club |clubname = Raith Rovers |image = [[File:Raith Rovers F.C. Crest.png|180]] |fullname = Raith Rovers Football Club |nickname = The Rovers |current = 2016–17 Raith Rovers F.C. season |founded = {{Start date and age|df=yes|1883}} |ground = [[Stark's Park]],<br/>[[Kirkcaldy]], [[Scotland]] |capacity = {{SPFL-stadiums|raith}}<ref name="capacity"/> |chairman = Alan Young |manager = [[Gary Locke (Scottish footballer)|Gary Locke]] |league = {{Scottish football updater|RaithRov}} |season = {{Scottish football updater|RaithRov2}} |position = {{Scottish football updater|RaithRov3}} |pattern_la1= |pattern_b1=_whiteshoulders |pattern_sh1= _sides_on_white |pattern_so1= |leftarm1=ffffff |body1=15317E |rightarm1=ffffff |shorts1=15317E |socks1=15317E |pattern_la2=_whiteborder |pattern_b2=_blackhoops |pattern_ra2=_whiteborder |pattern_sh2=_black_thinstripe_color | |pattern_so2=_top_on_black |leftarm2=083F2C |body2=083F2C |rightarm2=083F2C |shorts2=083F2C |socks2=083F2C |pattern_la3=_redshoulders |pattern_b3=_redshoulders |pattern_ra3=_redshoulders |pattern_sh3=_red stripes |pattern_so3= |leftarm3=FFFFFF |body3=FFFFFF |rightarm3=FFFFFF |shorts3=FFFFFF |socks3=FFFFFF | website =http://raithrovers.net/index.php/ }} `;
let obj = wtf.parse(str).infoboxes[0].data;
console.log(obj);
