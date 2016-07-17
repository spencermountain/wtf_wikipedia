'use strict';
const wtf_wikipedia = require('./src/index');
let parse = wtf_wikipedia.parse;

// wtf_wikipedia.from_api("Tomb_Raider_(2013_video_game)", 'en', function(s) {
//   console.log(wtf_wikipedia.parse(s).infobox)
// })

// wtf_wikipedia.from_api("On A Friday", function(page) {
//   var parsed = wtf_wikipedia.parse(page); // causes the crash
//   console.log(parsed);
// });

function from_file(page){
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  // return wtf_wikipedia.plaintext(str)
  return wtf_wikipedia.parse(str);
}

// from_file("list")
// from_file("Toronto")
// from_file('Toronto_Star');
// from_file('royal_cinema');
// from_file("Jodie_Emery")
// from_file("Redirect")
// from_file("Africaans")
// from_file("Anarchism")

// wtf_wikipedia.from_api('Toronto', 'fr', function(markup) {
//   var obj = wtf_wikipedia.parse(markup);
//   console.log(obj.infobox);
// })

let tmp = `
{{Infobox university
| name = The University of Alabama
| image_name = BamaSeal.png
| image_size = 150px
| established = 1831
| type = [[Flagship university|Flagship]]<br />[[State university system|Public university]]<br />[[Sea-grant]]<br />[[Space-grant]]
| endowment = $667,980,131<ref name="ReferenceA">http://colleges.usnews.rankingsandreviews.com/best-colleges/university-of-alabama-1051</ref><ref name="colleges.usnews.rankingsandreviews.com">{{cite web|url=http://colleges.usnews.rankingsandreviews.com/best-colleges/university-of-alabama-1051 |title=University of Alabama|work=rankingsandreviews.com}}</ref>
| president = [[Stuart R. Bell]]
| faculty = 1,175
| students = 37,098 (Fall 2015)<ref name=CommonDataSet>{{cite web|url=http://oira.ua.edu/d/content/reports/common-data-set|title=Common Data Set - OIRA|work=ua.edu}}</ref>
| postgrad = 5,140 (Fall 2015)<ref name=CommonDataSet/>
| undergrad = 31,958 (Fall 2015)<ref name=CommonDataSet/>
| city = [[Tuscaloosa, Alabama|Tuscaloosa]]
| state = [[Alabama]]
| country = U.S.
| campus = Urban (small city);<br/>{{convert|1970|acre}}
| coor = {{coord|33.209438|N|87.541493|W|source:dewiki_region:US-AL_type:landmark|display=inline,title}}
| athletics = [[NCAA Division I]] – [[Southeastern Conference|SEC]]
|free_label = Sports Motto
| free = [[Roll Tide]]
| colors = Crimson & White<ref>{{cite web|url=http://visualid.ua.edu/download/UA-BrandingStandards-Aug172015.pdf|title=The University of Alabama Branding Standards 2015–2016 |work=ua.edu}}</ref><br />{{color box|#9E1B32}}&nbsp;{{color box|#FFFFFF}}
| nickname = [[Alabama Crimson Tide]]
| mascot = [[Big Al (mascot)|Big Al]]
| affiliations = {{unbulleted list|[[University of Alabama System]]|[[Oak Ridge Associated Universities|ORAU]]|[[Universities Research Association|URA]]|[[Association of Public and Land-Grant Universities|APLU]]}}
| website = {{url|www.ua.edu}}
| logo = [[File:University of Alabama (logo).png|250px]]
}}
`;
console.log(wtf_wikipedia.parse(tmp).infobox.athletics);
// console.log(wtf_wikipedia.parse('Mount Sinai Hospital, [[St. Michaels Hospital (Toronto)|St. Michaels Hospital]], North York').text.Intro);
