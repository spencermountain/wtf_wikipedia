import type { SectionData } from '../../../types/index.ts'
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
const openTag = `< ?(${ignore.join('|')}) ?[^>]{0,200}>`
const closeTag = `< ?/ ?(${ignore.join('|')}) ?>`
const anyChar = '\\s\\S' //including newline
//bound the content-length, so unclosed tags don't scan to the end of large pages
const noThanks = new RegExp(`${openTag}[${anyChar}]{1,40000}?${closeTag}`, 'gi')

const parseHtml = function (section: SectionData) {
  let wiki = section.remaining

  const toTemplate = function (match: string, replace: string) {
    section.templates.push({ template: 'html', kind: 'html', text: replace, data: null, wiki: match })
    return replace
  }

  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, (m) => toTemplate(m, ' '))
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%.\-#:;'" ]{2,100}\/? ?> ?/g, (m) => toTemplate(m, ' ')) //<ref name="asd">
  //only kill ref tags if they are selfclosing
  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, (m) => toTemplate(m, ' ')) //<ref name="asd"/>

  // convert these html tags to known formatting
  wiki = wiki.replace(/<i>(.*?)<\/i>/g, `''$1''`)
  wiki = wiki.replace(/<b>(.*?)<\/b>/g, `'''$1'''`)

  // these are better-handled with templates
  wiki = wiki.replace(/<sub>(.*?)<\/sub>/g, `{{sub|$1}}`)
  wiki = wiki.replace(/<sup>(.*?)<\/sup>/g, `{{sup|$1}}`)
  wiki = wiki.replace(/<blockquote>(.*?)<\/blockquote>/g, `{{blockquote|text=$1}}`)

  // convert `nowiki` content by replacing ASCII punctuation and symbols with HTML entities
  // so they pass through without being processed as wiki syntax
  wiki = wiki.replace(/<nowiki>([\s\S]*?)<\/nowiki>/gi, (_, inner) =>
    inner.replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g, (m) => `&#${m.charCodeAt(0)};`)
  )

  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ /]?(p|sub|sup|span|div|table|br|tr|td|th|pre|pre2|hr|u)[ /]?> ?/g, (m) =>
    toTemplate(m, ' ')
  ) //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ /]?(abbr|bdi|bdo|cite|del|dfn|em|ins|kbd|mark|q|s|small)[ /]?> ?/g, (m) =>
    toTemplate(m, ' ')
  ) //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ /]?h[0-9][ /]?> ?/g, (m) => toTemplate(m, ' ')) //<h2>, </h2>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, (m) => toTemplate(m, '\n')) //<br />
  section.remaining = wiki.trim()
  return section
}
export default parseHtml
