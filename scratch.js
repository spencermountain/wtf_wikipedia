'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  let r = wtf.parse(str);
  console.log(r.infoboxes);
  return r;
}
// from_file('list');
// from_file("earthquakes");
// from_file('al_Haytham');
// from_file('redirect');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Toronto_Star');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('United-Kingdom');
//Ibn al-Haytham

// Akdam, Alanya 9314940
// Akçatı, Alanya 9314941
// Alacami, Alanya 9314942
// List of compositions by Franz Schubert 9314943

// wtf.from_api('Hardi class destroyer', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj.sections[0].tables[0][0]);
// });

var str = `{{Infobox country
| common_name = United Kingdom
| linking_name = the United Kingdom<!--Note: "the" required here as this entry used to create wikilinks-->
| name = {{collapsible list
  | titlestyle = background:transparent;line-height:normal;font-size:84%;
  | title = {{resize|1.25em|United Kingdom of Great<br/> Britain and Northern Ireland}}
  | {{Infobox |subbox=yes |bodystyle=font-size:76%;font-weight:normal;
  <!--Anglo-->
   | rowclass1 = mergedrow |label1=[[Scots language|Scots]]: |data1={{lang|sco|''Unitit Kinrick o Great Breetain an Northren Ireland''}}
   | rowclass2 = mergedrow |label2=[[Ulster Scots dialects|Ulster Scots]]:|data2={{lang|sco|''Claught Kängrick o Docht Brätain an Norlin Airlann''}}
  <!--Brittonic-->
   | rowclass3 = mergedrow |label3=[[Welsh language|Welsh]]: |data3={{lang|cy|''Teyrnas Unedig Prydain Fawr a Gogledd Iwerddon''}}
   | rowclass4 = mergedrow |label4=[[Cornish language|Cornish]]: |data4={{lang|kw|''Rywvaneth Unys Breten Veur ha Kledhbarth Iwerdhon''}}
  <!--Goidelic-->
   | rowclass5 = mergedrow |label5=[[Scottish&nbsp;Gaelic]]: |data5={{lang|gd|''Rìoghachd Aonaichte Bhreatainn is Èireann a Tuath''}}
   | rowclass6 = mergedrow |label6=[[Irish language|Irish]]: |data6={{lang|ga|''Ríocht Aontaithe na Breataine Móire agus Thuaisceart Éireann''}}
  }}
  }}
| image_flag = Flag of the United Kingdom.svg
}}`;
console.log(wtf.parse(str).infoboxes[0]);
