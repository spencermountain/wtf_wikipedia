const kill_xml = require('./kill_xml');

function cleanup_misc(wiki) {
  //the dump requires us to unescape xml
  //remove comments
  wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/, '');
  //horizontal rule
  wiki = wiki.replace(/--{1,3}/, '');
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ');
  //kill off interwiki links
  wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, '');
  //bold and italics combined
  wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, '$1');
  //bold
  wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, '$1');
  //italic
  wiki = wiki.replace(/''([^']{0,200})''/g, '$1');
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki);

  return wiki;
}
module.exports = cleanup_misc;
// console.log(cleanup_misc("hi [[as:Plancton]] there"));
// console.log(cleanup_misc('hello <br/> world'))
// console.log(cleanup_misc("hello <asd f> world </h2>"))
