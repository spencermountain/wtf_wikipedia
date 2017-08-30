const languages = require('../../data/languages');
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// templates that need parsing and replacing for inline text
//https://en.wikipedia.org/wiki/Category:Magic_word_templates
const word_templates = function(wiki) {
  //we can be sneaky with this template, as it's often found inside other templates
  wiki = wiki.replace(/\{\{URL\|([^ ]{4,100}?)\}\}/gi, '$1');
  //this one needs to be handled manually
  wiki = wiki.replace(/\{\{convert\|([0-9]*?)\|([^\|]*?)\}\}/gi, '$1 $2'); //TODO: support https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  //date-time templates
  let d = new Date();
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAY(2)?\}\}/gi, d.getDate());
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)MONTH(NAME|ABBREV)?\}\}/gi, months[d.getMonth()]);
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)YEAR\}\}/gi, d.getFullYear());
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAYNAME\}\}/gi, days[d.getDay()]);
  //formatting templates
  wiki = wiki.replace(/\{\{(lc|uc|formatnum):(.*?)\}\}/gi, '$2');
  wiki = wiki.replace(/\{\{pull quote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
  wiki = wiki.replace(/\{\{cquote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');

  //font-size
  wiki = wiki.replace(/\{\{(small|smaller|midsize|larger|big|bigger|large|huge|resize)\|([\s\S]*?)\}\}/gi, '$2');
  //{{font|size=x%|text}}

  if (wiki.match(/\{\{dts\|/)) {
    let date = (wiki.match(/\{\{dts\|(.*?)[\}\|]/) || [])[1] || '';
    date = new Date(date);
    if (date && date.getTime()) {
      wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, date.toDateString());
    } else {
      wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, ' ');
    }
  }
  if (wiki.match(/\{\{date\|.*?\}\}/)) {
    let date = wiki.match(/\{\{date\|(.*?)\|(.*?)\|(.*?)\}\}/) || [] || [];
    let dateString = date[1] + ' ' + date[2] + ' ' + date[3];
    wiki = wiki.replace(/\{\{date\|.*?\}\}/gi, dateString);
  }
  //common templates in wiktionary
  wiki = wiki.replace(/\{\{term\|(.*?)\|.*?\}\}/gi, "'$1'");
  wiki = wiki.replace(/\{\{IPA\|(.*?)\|.*?\}\}/gi, '$1');
  wiki = wiki.replace(/\{\{sense\|(.*?)\|?.*?\}\}/gi, '($1)');
  wiki = wiki.replace(/\{\{t\+?\|...?\|(.*?)(\|.*)?\}\}/gi, "'$1'");
  //replace languages in 'etyl' tags
  if (wiki.match(/\{\{etyl\|/)) {
    //doesn't support multiple-ones per sentence..
    var lang = wiki.match(/\{\{etyl\|(.*?)\|.*?\}\}/i)[1] || '';
    lang = lang.toLowerCase();
    if (lang && languages[lang]) {
      wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, languages[lang].english_title);
    } else {
      wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, '($1)');
    }
  }
  return wiki;
};
// console.log(word_templates("hello {{CURRENTDAY}} world"))
// console.log(word_templates("hello {{CURRENTMONTH}} world"))
// console.log(word_templates("hello {{CURRENTYEAR}} world"))
// console.log(word_templates("hello {{LOCALDAYNAME}} world"))
// console.log(word_templates("hello {{lc:88}} world"))
// console.log(word_templates("hello {{pull quote|Life is like\n|author=[[asdf]]}} world"))
// console.log(word_templates("hi {{etyl|la|-}} there"))
// console.log(word_templates("{{etyl|la|-}} cognate with {{etyl|is|-}} {{term|hugga||to comfort|lang=is}},"))

module.exports = word_templates;
