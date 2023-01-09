import languages from '../../../_data/languages.js'

//grab the first, second or third pipe..
let templates = {
  p1: 0,
  p2: 1,
  p3: 2,
  resize: 1, //https://en.wikipedia.org/wiki/'Resize',
  lang: 1,
  'rtl-lang': 1,
  l: 2,
  h: 1, //https://en.wikipedia.org/wiki/'Hover_title',
  sort: 1, //https://en.wikipedia.org/wiki/'Sort',
}

//templates that we simply grab their insides as plaintext
let zeros = [
  'defn',
  'lino', //https://en.wikipedia.org/wiki/'Linum',
  'finedetail', //https://en.wikipedia.org/wiki/'Finedetail',
  'nobold',
  'noitalic',
  'nocaps',
  'vanchor', //https://en.wikipedia.org/wiki/'Visible_anchor',
  'rnd',
  'date', //Explictly-set dates - https://en.wikipedia.org/wiki/'Date',
  'taste',
  'monthname',
  'baseball secondary style',
  'nowrap',
  'nobr',
  'big',
  'cquote',
  'pull quote',
  'smaller',
  'midsize',
  'larger',
  'big',
  'kbd',
  'bigger',
  'large',
  'mono',
  'strongbad',
  'stronggood',
  'huge',
  'xt',
  'xt2',
  '!xt',
  'xtn',
  'xtd',
  'dc',
  'dcr',
  'mxt',
  '!mxt',
  'mxtn',
  'mxtd',
  'bxt',
  '!bxt',
  'bxtn',
  'bxtd',
  'delink', //https://en.wikipedia.org/wiki/'Delink',
  'pre',
  'var',
  'mvar',
  'pre2',
  'code',
  'char',
  'angle bracket',
  'angbr',
  'symb',
  'dabsearch',
  'key press', //needs work - https://en.m.wikipedia.org/wiki/'Key_press',
  // these should escape certain chars
  'nowiki',
  'nowiki2',
  'unstrip',
  'UnstripNoWiki',
  'plain text',
  'make code',
  'killmarkers',
]
zeros.forEach((k) => {
  templates[k] = 0
})

//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach((k) => {
  templates['lang-' + k] = 0
})
// more languages
let more = [
  'sr-latn-cyrl', //first parameter latin, second cyrillic
  'sr-cyrl-latn', //first parameter cyrillic, second latin
  'sr-latn', //one parameter latin
  'sr-cyrl', //one parameter cyrillic
  'sr-cyr',
  'sh-latn-cyrl', //for both Latin and Cyrillic in that order
  'sh-cyrl-latn', //for both Cyrillic and Latin in that order
  'sh-latn', //for Latin
  'sh-cyrl', //for Cyrillic
  'cel-1bd',
  'cel-x-proto',
  'en-emodeng',
  'de-at',
  'de-ch',
  'gem-x-proto',
  'gsw-fr',
  'nds-nl',
  'nl-be',
  'ku-arab',
  'ku-cyrl',
  'pt-br',
  'fra-frc',
  'fra-que',
  'roa-leo',
  'roa-nor',
  'ca-valencia',
  'ast-leo',
  'grc-gre',
  'grc-x-doric',
  'grc-x-proto',
  'grc-x-medieval'
]
more.forEach((k) => {
  templates['lang-' + k] = 0
})

export default templates
