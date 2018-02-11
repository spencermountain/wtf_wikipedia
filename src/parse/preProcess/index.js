const kill_xml = require('./kill_xml');
const wordTemplates = require('./word_templates');

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(r, wiki) {
  //remove comments
  wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //horizontal rule
  wiki = wiki.replace(/--{1,3}/, '');
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ');
  //kill off interwiki links
  wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, '');
  //expand inline templates like {{date}}
  wiki = wordTemplates(wiki, r);
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki, r);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\( \)/g, '');
  return wiki;
}
module.exports = preProcess;
// console.log(preProcess("hi [[as:Plancton]] there"));
// console.log(preProcess('hello <br/> world'))
// console.log(preProcess("hello <asd f> world </h2>"))
