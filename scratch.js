const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('Jurassic Park (film)');
// var doc = await wtf.random();
// let list = await wtf.category('National Basketball Association teams');
// let list = await wtf.category(856891);
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// (async () => {
//   wtf.fetch('List of Apollo astronauts').then((doc) => {
//
//     let s = doc.sections('Apollo astronauts who walked on the Moon');
//     let arr = s.tables(0).keyValue().map((o) => {
//       return {
//         name: o.col2,
//         birth: o.col3,
//         death: o.col4,
//       };
//     });
//
//     console.log(arr);
//   });
// })();


// let str = `
// ;Cleveland Cavaliers
// {{NBA roster statistics start|team=Cleveland Cavaliers}}
// |-
// | style="text-align:left;"| {{sortname|Matthew|Dellavedova}} || 6 || 0 || 7.6 || .263 || .167 || .833 || 0.5 || 1.0 || 0.0 || 0.0 || 2.7
// |-
// | style="text-align:left;"| {{sortname|Channing|Frye}} || 4 || 0 || 8.3 || .000 || .000 || '''1.000''' || 0.8 || 0.0 || 0.0 || 0.5 || 0.5
// |-
// | style="text-align:left;"| {{sortname|Kyrie|Irving}} || 7 || 7 || 39.0 || .468 || '''.405''' || .939 || 3.9 || 3.9 || 2.1 || 0.7 || 27.1
// |-! style="background:#FDE910;"
// | style="text-align:left;"| {{sortname|LeBron|James}} || 7 || 7 || '''41.7''' || .494 || .371 || .721 || '''11.3''' || '''8.9''' || '''2.6''' || '''2.3''' || '''29.7'''
// |-
// | style="text-align:left;"| {{sortname|Richard|Jefferson}} || 7 || 2 || 24.0 || .516 || .167 || .636 || 5.3 || 0.4 || 1.3 || 0.1 || 5.7
// |-
// | style="text-align:left;"| {{sortname|Mo|Williams}} || 6 || 0 || 4.8 || .333 || .200 || .000 || 0.5 || 0.2 || 0.5 || 0.0 || 1.5
// {{s-end}}`;

// let str = `
// {| class="wikitable sortable"
// |- style="background:#ccc;"
// | style="width:20px;"|
// | style="width:120px;"| '''Name'''
// | style="width:120px;"| '''Born'''
// | style="width:120px;"| '''Died'''
// | style="width:85px;"| '''Age at<br>first step'''
// | style="width:70px;"| '''Mission'''
// | style="width:146px;"| '''Lunar [[Extravehicular activity|EVA]] dates'''
// | style="width:80px;"| '''Service'''
// | style="width:180px;"| '''Alma Mater'''
// |- style="background:#def;"
// | align=center|{{font color|#ddeeff|0}}1. || [[Neil Armstrong]]|| {{Birth date|1930|8|5}} || {{Death date and age|2012|8|25|1930|8|5}} || 38y 11m 15d
// |rowspan="2"| [[Apollo 11]] ||rowspan="2"| July 21, 1969<ref name="Ap11Date">This date is based on [[Coordinated Universal Time]] (UTC). Americans alive at the time remember it as the night of July 20, 1969 (Armstrong set foot on the Moon at 10:56 p.m. Eastern Daylight Time), but the official NASA chronology was kept in [[Greenwich Mean Time]] (GMT), so the first step was 2:56 a.m. on the 21st: [https://history.nasa.gov/SP-4029/Apollo_11i_Timeline.htm]</ref> || [[NASA]]<ref name="civilian">Armstrong had left the US Navy and was already a NASA employee when he and [[Elliot See]] became the first civilian astronauts in Astronaut Group 2. See Armstrong's [https://history.nasa.gov/ap11ann/astrobios.htm#Armstrong NASA biography] and a [http://www.nasa.gov/vision/space/features/armstrong_ambassador_of_exploration.html description of his receiving a NASA award], among others.</ref> || [[Purdue University]], [[University of Southern California]]
// |- style="background:#def;"
// | align=center|{{font color|#ddeeff|0}}2. || [[Buzz Aldrin]]|| {{Birth date and age|1930|1|20}} || || 39y 6m 0d || [[United States Air Force|Air Force]] || [[United States Military Academy]], [[Massachusetts Institute of Technology|MIT]]
// |- style="background:#ffe8e8;"
// | align=center|{{font color|#ffe8e8|0}}3. || [[Pete Conrad]]|| {{Birth date|1930|6|2}} || {{Death date and age|1999|7|8|1930|6|2}}|| 39y 5m 17d
// |rowspan="2"| [[Apollo 12]] ||rowspan="2"| November 19–20, 1969 || [[United States Navy|Navy]] || [[Princeton University]]
// |- style="background:#ffe8e8;"
// | align=center|{{font color|#ffe8e8|0}}4. || [[Alan Bean]]|| {{Birth date|1932|3|15}} || {{Death date and age|2018|5|26|1932|3|15}} || 37y 8m 4d || [[United States Navy|Navy]] || [[University of Texas, Austin]]
// |- style="background:#def;"
// | align=center|{{font color|#ddeeff|0}}5. || [[Alan Shepard]]|| {{Birth date|1923|11|18}} || {{Death date and age|1998|7|21|1923|11|18}} || 47y 2m 18d
// |rowspan="2"| [[Apollo 14]] ||rowspan="2"| February 5–6, 1971 || [[United States Navy|Navy]] || [[United States Naval Academy]], [[Naval War College]]
// |- style="background:#def;"
// |}`;

// let str = '{{start date|1993|02|24|08|||-07:00}}';

let str = `{{Infobox scientist
|hi = fun
|name = {{nowrap| {{marriage|[[Elsa Löwenthal]]}} }}
}}`;
console.log(wtf(str).infobox(0).data);
