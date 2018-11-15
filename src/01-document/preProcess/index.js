const kill_xml = require('./kill_xml');

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(r, wiki, options) {
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/g, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //horizontal rule
  wiki = wiki.replace(/----/g, '');
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{\}\}/g, ' – ');
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ');
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
