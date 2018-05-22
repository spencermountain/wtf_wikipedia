// const languages = require('../../data/languages');
// const parseCoord = require('./coordinates');

const inline = /\{\{(url|convert|current|local|lc|uc|formatnum|pull|cquote|coord|small|smaller|midsize|larger|big|bigger|large|huge|resize|dts|date|term|ipa|ill|sense|t|etyl|sfnref|OldStyleDate)(.*?)\}\}/gi;

// templates that need parsing and replacing for inline text
//https://en.wikipedia.org/wiki/Category:Magic_word_templates
const word_templates = function(wiki) {
  //greedy-pass at easier, inline-templates
  wiki = wiki.replace(inline, function(tmpl) {

    if (tmpl.match(/^\{\{dts\|/)) {
      let date = (tmpl.match(/^\{\{dts\|(.*?)[\}\|]/) || [])[1] || '';
      date = new Date(date);
      if (date && date.getTime()) {
        tmpl = tmpl.replace(/^\{\{dts\|.*?\}\}/gi, date.toDateString());
      } else {
        tmpl = tmpl.replace(/^\{\{dts\|.*?\}\}/gi, ' ');
      }
    }
    // if (tmpl.match(/^\{\{date\|.*?\}\}/)) {
    //   let date = tmpl.match(/^\{\{date\|(.*?)\|(.*?)\|(.*?)\}\}/) || [] || [];
    //   let dateString = date[1] + ' ' + date[2] + ' ' + date[3];
    //   tmpl = tmpl.replace(/^\{\{date\|.*?\}\}/gi, dateString);
    // }
    //common templates in wiktionary
    // tmpl = tmpl.replace(/^\{\{term\|(.*?)\|.*?\}\}/gi, '\'$1\'');
    tmpl = tmpl.replace(/^\{\{IPA(c-en)?\|(.*?)\|(.*?)\}\},?/gi, '');
  // tmpl = tmpl.replace(/^\{\{sense\|(.*?)\|?.*?\}\}/gi, '($1)');
  // tmpl = tmpl.replace(/v\{\{t\+?\|...?\|(.*?)(\|.*)?\}\}/gi, '\'$1\'');
  //replace languages in 'etyl' tags
  //   if (tmpl.match(/^\{\{etyl\|/)) {
  //     //doesn't support multiple-ones per sentence..
  //     var lang = (tmpl.match(/^\{\{etyl\|(.*?)\|.*?\}\}/i) || [])[1] || '';
  //     lang = lang.toLowerCase();
  //     if (lang && languages[lang]) {
  //       tmpl = tmpl.replace(/^\{\{etyl\|(.*?)\|.*?\}\}/gi, languages[lang].english_title);
  //     } else {
  //       tmpl = tmpl.replace(/^\{\{etyl\|(.*?)\|.*?\}\}/gi, '($1)');
  //     }
  //   }
  //   return tmpl;
  });
  //flatlist -> commas  -- hlist?
  // wiki = wiki.replace(/\{\{(flatlist|hlist) ?\|([^}]+)\}\}/gi, function(a, b, c) {
  //   let arr = c.split(/\s+[* ]+? ?/g);
  //   arr = arr.filter(line => line);
  //   return arr.join(', ');
  // });
  //plainlist -> newlines
  wiki = wiki.replace(/\{\{(plainlist|ublist|unbulleted list) ?\|([^}]+)\}\}/gi, function(a, b, c) {
    let arr = c.split(/\s+[* ]+? ?/g);
    arr = arr.filter(line => line);
    return arr.join(', ');
  });
  // tmpl = tmpl.replace(/\{\{flatlist\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
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
