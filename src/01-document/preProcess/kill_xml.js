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
  'references',
  'source',
  'syntaxhighlight',
  'timeline',
  'maplink',
]
const openTag = `< ?(${ignore.join('|')}) ?[^>]{0,200}?>`
const closeTag = `< ?/ ?(${ignore.join('|')}) ?>`
const anyChar = '\\s\\S' //including newline
const noThanks = new RegExp(`${openTag}[${anyChar}]+?${closeTag}`, 'gi')

const kill_xml = function (wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' ')
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%.\-#:;'" ]{2,100}\/? ?> ?/g, ' ') //<ref name="asd">
  //only kill ref tags if they are selfclosing
  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' ') //<ref name="asd"/>

  // convert these html tags to known formatting
  wiki = wiki.replace(/<i>(.*?)<\/i>/g, `''$1''`)
  wiki = wiki.replace(/<b>(.*?)<\/b>/g, `'''$1'''`)

  // these are better-handled with templates
  wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, `{{sub|$1}}`)
  wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, `{{sup|$1}}`)
  wiki = wiki.replace(/<blockquote>(.*?)<\/blockquote>/g, `{{blockquote|text=$1}}`)

  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ /]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr|u)[ /]?> ?/g, ' ') //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ /]?(abbr|bdi|bdo|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ /]?> ?/g, ' ') //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ /]?h[0-9][ /]?> ?/g, ' ') //<h2>, </h2>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n') //<br />
  return wiki.trim()
}
export default kill_xml
