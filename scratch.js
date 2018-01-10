'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  let r = wtf.parse(str);
  console.log(r.infoboxes[0].data);
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

var str = `{{infobox country
  | symbol_width = 90px
  | alt_coat = Coat of arms containing shield and crown in centre, flanked by lion and unicorn
  | symbol_type = [[Royal coat of arms of the United Kingdom|Royal coat of arms]]<wbr/>{{#tag:ref |An alternative variant of the Royal coat of arms is used in Scotland: [[:File:Royal Coat of Arms of the United Kingdom (Scotland).svg|[click to view image]]].|group=note}}
  | national_anthem = "[[God Save the Queen]]"{{#tag:ref |There is no authorised version of the national anthem as the words are a matter of tradition; only the first verse is usually sung.<ref>{{cite web |title=National Anthem |url=https://www.royal.uk/national-anthem |website=Official web site of the British Royal Family |accessdate=4 June 2016}}</ref> No law was passed making "God Save the Queen" the official anthem. In the English tradition, such laws are not necessary; proclamation and usage are sufficient to make it the national anthem. "God Save the Queen" also serves as the [[Honors music|Royal anthem]] for certain [[Commonwealth realms]]. The words ''Queen, she, her'', used at present (in the reign of Elizabeth II), are replaced by ''King, he, him'' when the monarch is male. |group=note}}
  <div style="display:inline-block;margin-top:0.4em;">[[File:United States Navy Band - God Save the Queen.ogg]]</div>
  | image_map = EU-United Kingdom.svg
  | alt_map = Two islands to the north-west of continental Europe. Highlighted are the larger island and the north-eastern fifth of the smaller island to the west.
  | map_caption = {{map_caption |countryprefix=the |location_color=dark green |region=Europe |region_color=dark grey |subregion=the [[European&nbsp;Union]] |subregion_color=green}}
}}`;
console.log(wtf.parse(str).infoboxes[0].data);
