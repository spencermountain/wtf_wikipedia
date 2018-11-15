//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

//these are things we throw-away
//these will mess-up if they're nested, but they're not usually.
const ignore = [
  'table',
  'code',
  'score',
  'data',
  'categorytree',
  'charinsert',
  'hiero',
  'imagemap',
  'inputbox',
  'nowiki',
  'poem',
  'references',
  'source',
  'syntaxhighlight',
  'timeline'
];
const openTag = `< ?(${ignore.join('|')}) ?[^>]{0,200}?>`;
const closeTag = `< ?/ ?(${ignore.join('|')}) ?>`;
const anyChar = '\\s\\S'; //including newline
const noThanks = new RegExp(`${openTag}[${anyChar}]+?${closeTag}`, 'ig');

const kill_xml = function(wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' ');
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
module.exports = kill_xml;
