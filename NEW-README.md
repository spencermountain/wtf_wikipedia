<div align="center">

  <div>wikipedia parser</div>
  <div><img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" /></div>

  <div align="center">
    <a href="https://npmjs.org/package/wtf_wikipedia">
      <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
    </a>
    <a href="https://codecov.io/gh/spencermountain/wtf_wikipedia">
      <img src="https://codecov.io/gh/spencermountain/wtf_wikipedia/branch/master/graph/badge.svg" />
    </a>
    <a href="https://unpkg.com/wtf_wikipedia/builds/wtf_wikipedia.min.js">
      <img src="https://badge-size.herokuapp.com/spencermountain/wtf_wikipedia/master/builds/wtf_wikipedia.min.js" />
    </a>
  </div>

  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      contributors
    </a>
  </sub>
</div>
<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

```js
const wtf = require('wtf_wikipedia');

wtf.fetch('Toronto Raptors').then(doc => {

  doc.categories() // ['National Basketball Association teams', 'Basketball teams in Toronto', ...]

  doc.sentences(0).text() // 'The Toronto Raptors are a Canadian professional basketball team based in Toronto.'

  doc.infobox().get('coach').text() // 'Nick Nurse'

  doc.references().length // 219

  doc.images(0).thumb() // 'https://wikipedia.org/wiki/Special:Redirect/file/RogersCentre_Toronto_Sept1-05.jpg?width=300'
})
```

### Ok first,
[wikitext](https://en.wikipedia.org/wiki/Help:Wikitext) is [really](https://utcc.utoronto.ca/~cks/space/blog/programming/ParsingWikitext), [really](https://en.wikipedia.org/wiki/Wikipedia_talk:Times_that_100_Wikipedians_supported_something) [hard](https://twitter.com/ftrain/status/1036060636587978753) to parse. 
It is among the most-curious and ad-hoc data-formats you'll ever find.

Consider:
* the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax)
* ['Birth_date_and_age'](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) vs ['Birth-date_and_age'](https://en.wikipedia.org/wiki/Template:Birth-date_and_age).
* the partial-implementation of [inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),
* wikitext doesn't have any errors
* deep recursion of [similar-syntax](https://en.wikipedia.org/wiki/Wikipedia:Database_reports/Templates_transcluded_on_the_most_pages) templates,
* nested elements do not honour the scope of other elements
* the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) for image paths,
* the [custom encoding](https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical_restrictions)) of whitespace and punctuation,
* [right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates.
* [PEG](https://pegjs.org/) based parsers struggle with wikitext's massive backtracking
* as of Nov-2018, there are [634,755](https://s3-us-west-1.amazonaws.com/spencer-scratch/allTemplates-2018-10-26.tsv) templates in wikipedia
* there are a large number of pages that also don't render properly on wikipedia.

**wtf_wikipedia** supports many ***recursive shenanigans***, depreciated and **obscure template**
variants, and illicit 'wiki-esque' shorthands.

it really tries its best, though it is [very](https://osr.cs.fau.de/wp-content/uploads/2017/09/wikitext-parser.pdf) hard.

### What it does:
* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* **Per-sentence** plaintext and link resolution
* Parse and format internal links
* creates
  [image thumbnail urls](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F)
  from **File:XYZ.png** filenames
* Properly resolve ***{{CURRENTMONTH}}*** and ***{{CONVERT ..}}*** type templates
* Parse **images**, **headings**, and **categories**
* converts 'DMS-formatted' ***(59°12\'7.7"N)*** geo-coordinates to lat/lng
* parses citation metadata
* Eliminate xml, latex, css, and table-sorting cruft

### What doesn't do:
* external '[transcluded](https://en.wikipedia.org/wiki/Wikipedia:Transclusion)' page data [1](https://github.com/spencermountain/wtf_wikipedia/issues/223)
* AST output
* smart (or 'pretty') formatting of html in infoboxes or galleries [1](https://github.com/spencermountain/wtf_wikipedia/issues/173)
* maintain perfect page order [1](https://github.com/spencermountain/wtf_wikipedia/issues/88)
* per-sentence references (by 'section' element instead)

It is built to be as flexible as possible. In all cases, the parser tries to fail in considerate ways.


<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## well ok then,
enough chat,
<kbd>npm install wtf_wikipedia</kbd>

```javascript
var wtf = require('wtf_wikipedia');

let str = `Whistling is featured in a number of television shows, such as [[Lassie (1954 TV series)|''Lassie'']], ''[[The Andy Griffith Show]]'' and the title theme for ''[[The X-Files]]''.`
let links = wtf(str).links()
links.map(l => l.page())
// [ 'Lassie (1954 TV series)',  'The Andy Griffith Show',  'The X-Files' ]

```

***on the client-side:***
```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script>
  // (follows redirect)
  wtf.fetch('On a Friday', function(err, doc) {
    var val = doc.infobox(0).get('current_members');
    val.links().map(link => link.page());
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  });
</script>
```

## Fetch
This library can grab, and automatically-parse articles from [any wikimedia api](https://www.mediawiki.org/wiki/API:Main_page). 
This includes any language, any wiki-project, and most 3rd-party wikis.
```js
// 3rd-party wiki
let doc = await wtf.fetch('https://muppet.fandom.com/wiki/Miss_Piggy')

// wikipedia français
doc = await wtf.fetch('Tony Hawk', 'fr')
doc.sentences(0).text()  // 'Tony Hawk est un skateboarder professionnel et un acteur ...'

// accept an array, or wikimedia pageIDs
let docs = wtf.fetch(['Whistling', 2983], {follow_redirects:false})

// article from german wikivoyage
wtf.fetch('Toronto', { lang: 'de', wiki: 'wikivoyage' }).then(doc => {
  console.log(doc.sentences(0).text()) // 'Toronto ist die Hauptstadt der Provinz Ontario'
})

```

### Good practice:
The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things, if you're going to hit it heavily -
* pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
* bundle multiple pages into one request as an array
* run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).
```js
wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
  'Api-User-Agent': 'spencermountain@gmail.com'
}).then((docList) => {
  let links = docList.map(doc => doc.links())
  console.log(links)
})
```
---

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## Plugins
* [wtf-plugin-html](https://github.com/spencermountain/wtf-plugin-html)
* [wtf-plugin-markdown](https://github.com/spencermountain/wtf-plugin-markdown)
* [wtf-plugin-latex](https://github.com/spencermountain/wtf-plugin-latex)
* [wtf-plugin-wikitext](https://github.com/spencermountain/wtf-plugin-wikitext)
* [wtf-mlb](https://github.com/spencermountain/wtf-mlb) - baseball team/season parser
* [wtf-nhl](https://github.com/spencermountain/wtf-nhl) - hockey team/season parser


---
## Configuration

### Adding new methods:
```js


```

### Adding new templates:
does your wiki use a `{{foo}}` template?
```js
wtf.extend((models, templates) => {
  // use a custom parser function
  templates.foo = (text, data) => {
    data.templates.push({name:'foo', cool:true})
    return 'new-text'
  }
  // array-syntax allows easy-labeling of parameters
  templates.foo = ['a', 'b', 'c']
  // number-syntax for returning 
  templates.baz = 0
})
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## See also:
* [instaview](https://github.com/cscott/instaview) - javascript
* [txtwiki](https://github.com/joaomsa/txtwiki.js) - javascript
* [Parsoid](https://www.mediawiki.org/wiki/Parsoid) - javascript
* [wiky](https://github.com/Gozala/wiky) - javascript
* [sweble-wikitext](https://github.com/sweble/sweble-wikitext) - java
* [kiwi](https://github.com/aboutus/kiwi/) - C
* [parse_wiki_text](https://docs.rs/parse_wiki_text/) - rust
* [wikitext-perl](https://metacpan.org/pod/distribution/wikitext-perl/lib/Text/WikiText.pm) - perl
* [wikiextractor](https://github.com/attardi/wikiextractor) - python
* [wikitextparser](https://pypi.org/project/wikitextparser) - python

and [many more](https://www.mediawiki.org/wiki/Alternative_parsers)!

MIT