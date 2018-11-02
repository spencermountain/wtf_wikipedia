const kill_xml = require('./kill_xml');
const tokenizer = require('./tokenizer');

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(r, wiki, options) {
  if (options.hasOwnProperty("tokenize")) {
    if (options.tokenize.math && (options.tokenize.math == true)) {
      wiki = tokenizer.math(wiki, r, options);
    };
    if (options.tokenize.citation && (options.tokenize.citation == true)) {
      wiki = tokenizer.citation(wiki, r, options);
    };
    console.log("TOKENIZE:\n"+wiki+"\n----------------------------------");
    console.log("References: "+JSON.stringify(r.refs4token, null,4));
  };
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/g, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //horizontal rule
  wiki = wiki.replace(/----/g, '');
  //{{!}} - this weird thing https://www.mediawiki.org/wiki/Help:Magic_words#Other
  wiki = wiki.replace(/\{\{!\}\}/g, '|');
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{(–|ndash|en dash)\}\}/ig, '–');
  wiki = wiki.replace(/\{\{(—|em dash)\}\}/ig, '—');
  wiki = wiki.replace(/\{\{\}\}/g, ' – ');
  wiki = wiki.replace(/\{\{•\}\}/g, ' •');
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ');
  wiki = wiki.replace(/\{\{ambersand\}\}/ig, '&');
  wiki = wiki.replace(/\{\{snds\}\}/ig, ' – ');
  // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
  wiki = wiki.replace(/\{\{\^\}\}/g, '');
  //yup, oxford comma template
  wiki = wiki.replace(/\{\{\,\}\}/g, ',');
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ');
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki, r, options);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+?\)/g, '');
  return wiki;
}
module.exports = preProcess;
// console.log(preProcess("hi [[as:Plancton]] there"));
// console.log(preProcess('hello <br/> world'))
// console.log(preProcess("hello <asd f> world </h2>"))
