const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  const doc = await wtf.fetch(1984, 'en');
  console.log(doc.title());
})();


// let doc = readFile('toronto');
// console.log(doc.infobox(0).data);

// var doc = readFile('royal_cinema');
// console.log(doc.section(0));

// let str = `
//
//
// {| class="wikitable sortable plainrowheaders"
// |+ List of voice performances in direct-to-video and television films
// ! Year
// ! Title
// ! Role
// ! class="unsortable"| Notes
// ! class="unsortable"| Source
// |-
// | {{dts|2015|05|12|format=y}} || ''[[Batman Unlimited: Animal Instincts]]'' || Mech Guard #1, Wealthy Jock || || <ref name="btva"/><!-- <ref>{{cite AV media | at=Closing credits | title=[[Batman Unlimited: Animal Instincts]] | year=2015 | medium=film}}</ref>  -->
// |-
// | {{dts|2015|12|format=y}} || ''[[Marvel Super Hero Adventures: Frost Fight!]]'' || [[Captain America]], Gingerbread Men || || <ref name="btva"/><!-- <ref>{{cite AV media | at=Closing credits | title=Marvel Super Hero Adventures: Frost Fight | year=2015 | medium=film}}</ref>  -->
// |-
// | {{dts|2016|02|02|format=y}} || ''[[Batman: Bad Blood]]'' || [[Hellhound (comics)|Hellhound]], Chuckie Sol || || <ref name="btva"/><!-- <ref>{{cite AV media | at=Closing credits | title=[[Batman: Bad Blood]] | year=2016 | medium=film}}</ref> -->
// |-
// | {{dts|2017|03|14|format=y}} || ''[[K: Missing Kings]]'' || Kuroh Yatogami || || <ref>{{cite web |date=October 7, 2016 |url=https://www.animenewsnetwork.com/news/2016-10-07/viz-reveals-english-dub-cast-for-k-missing-kings-film/.107390 |title=Viz Reveals English Dub Cast for K: Missing Kings Film (Update 2) |publisher=[[Anime News Network]] |accessdate=October 7, 2016}}</ref>
// |}`;
// let str = `hello <!-- <ref>cite AV media | medium=film</ref>--> there`;
// var doc = wtf(str);
// console.log(doc.text());
