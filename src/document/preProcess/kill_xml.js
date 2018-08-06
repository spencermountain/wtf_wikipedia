//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext
const kill_xml = function(wiki) {
  //(parse <ref> tags in Section class) - luckily, refs can't be recursive.
  //other types of xml that we want to trash completely
  wiki = wiki.replace(/< ?(table|code|score|data|categorytree|charinsert|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?[^>]{0,200}?>[\s\S]*< ?\/ ?(table|code|score|data|categorytree|charinsert|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?>/gi, ' '); // <table name=""><tr>hi</tr></table>
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
  //only kill ref tags if they are selfclosing
  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' '); //<ref name="asd"/>
  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g, ' '); //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?> ?/g, ' '); //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, ' '); //<h2>, </h2>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n'); //<br />
  return wiki.trim();
};
// console.log(kill_xml("hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.}}"))
// console.log(kill_xml("hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4"))
// console.log(kill_xml('hello<ref name="theroyal"/> world <ref>nono</ref>, man}}'))
// console.log(kill_xml("hello<ref name=\"theroyal\"/> world5, <ref name=\"\">nono</ref> man"));
// console.log(kill_xml("hello <asd f> world </h2>"))
// console.log(kill_xml("North America,<ref name=\"fhwa\"> and one of"))
// console.log(kill_xml("North America,<br /> and one of"))
module.exports = kill_xml;
