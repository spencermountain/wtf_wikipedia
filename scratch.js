const wtf_wikipedia = require('./src/index');

// wtf_wikipedia.from_api("Tomb_Raider_(2013_video_game)", 'en', function(s) {
//   console.log(wtf_wikipedia.parse(s).infobox)
// })

// wtf_wikipedia.from_api("On A Friday", function(page) {
//   var parsed = wtf_wikipedia.parse(page); // causes the crash
//   console.log(parsed);
// });

function from_file(page){
  var str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
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
// console.log(wtf_wikipedia.parse('Mount Sinai Hospital, [[St. Michaels Hospital (Toronto)|St. Michaels Hospital]], North York').text.Intro);
