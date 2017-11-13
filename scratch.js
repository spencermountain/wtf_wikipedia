'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
// function from_file(page) {
//   let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
//   // console.log(wtf.plaintext(str));
//   let r = wtf.parse(str);
//   // console.log(r.infoboxes[0]);
//   // console.log(JSON.stringify(r.sections, null, 2));
//   return r;
// }

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

// Latitude (N/S) must appear before longitude (E/W)
// var str = `hello {{coord|43|42|N|79|24|W|region:CA-ON|display=inline,title}} world`;
// var str = `hello {{coord|43.2|-42.9|region:CA-ON|display=inline,title}} world`;
// var str = `hello {{Coord|44.112|N|87.913|S|display=title}} world`;
// var str = `hello {{myTempl|fun stuff!}} world`;
// var str = `hello {{main|fun}} world`;
// var str = `
// {{Main|Royal National Lifeboat Institution lifeboats}}
// The types of boats`;
// wtf.custom({
//   mine: (tmpl, wiki) => {
//     if (/^\{\{myTempl/.test(tmpl)) {
//       let m = tmpl.match(/^\{\{myTempl\|(.+?)\}\}$/);
//       wiki = wiki.replace(tmpl, m[1]);
//       return 'hooha!';
//     }
//     return null;
//   }
// });
// let obj = wtf.parse(str);
// console.log(obj.coordinates);
//
wtf.from_api('List_of_largest_cities', 'en', function(markup) {
  var data = wtf.parse(markup);
  console.log(data.sections[5].tables);
});


// var data = wtf.parse(str);
// console.log(data.sections[0]);
