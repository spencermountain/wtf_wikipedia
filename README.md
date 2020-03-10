<div align="center">
  <div><b>wtf_wikipedia</b></div>
  <img src="https://user-images.githubusercontent.com/399657/68222691-6597f180-ffb9-11e9-8a32-a7f38aa8bded.png"/>
  <div>parse data from wikipedia</div>
  <div><code>npm install wtf_wikipedia</code></div>
  <div align="center">
    <sub>
      by
      <a href="https://github.com/spencermountain">Spencer Kelly</a> and
      <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
        many contributors
      </a>
    </sub>
  </div>
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

<div align="center">
  <div>
    <a href="https://npmjs.org/package/wtf_wikipedia">
    <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
  </a>
  <a href="https://codecov.io/gh/spencermountain/wtf_wikipedia">
    <img src="https://codecov.io/gh/spencermountain/wtf_wikipedia/branch/master/graph/badge.svg" />
  </a>
  <a href="https://bundlephobia.com/result?p=wtf_wikipedia">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf_wikipedia/master/builds/wtf_wikipedia.min.js" />
  </a>
  </div>
</div>

<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="left">
  <img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
 <img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  it is <a href="https://osr.cs.fau.de/wp-content/uploads/2017/09/wikitext-parser.pdf">very</a>, <a href="https://utcc.utoronto.ca/~cks/space/blog/programming/ParsingWikitext">very</a> hard.
</div>

<!-- einstein sentence -->
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/43598341-75ca8f94-9652-11e8-9b91-cabae4fb1dce.png"/>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

```js
const wtf = require('wtf_wikipedia')
```

```js
wtf.fetch('Toronto Raptors').then(doc => {
  let coach = doc.infobox().get('coach')
  coach.text() //'Nick Nurse'

  doc.sentences(0).text() //'The Toronto Raptors are a Canadian professional basketball team based in Toronto.'
})
```

get plain-text:

```js
let str = `[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.`
wtf(str).text()
//"Boston's baseball field has a 37ft wall."
```

or get json:

```javascript
let doc = await wtf.fetch('Whistling')

let json = doc.json()
json.categories
//['Oral communication', 'Vocal music', 'Vocal skills']

let sec = doc.sections('see also')
sec.links().map(l => l.json())
//[{ page: 'Slide whistle' }, { page: 'Hand flute' }, { page: 'Bird vocalization' }...]

doc.images(0).json()
// {url: https://upload.wikimedia.org..../300px-Duveneck_Whistling_Boy.jpg', file: 'Image:Duveneck Whistling Boy.jpg' }
```

run on the client-side:

```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script>
  wtf.fetch('On a Friday', function(err, doc) {
    // get links from an infobox prop
    let members = doc.infobox().get('current members')
    members.links().map(l => l.page())
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  })
</script>
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

### Ok first, 🛀

[wikitext](https://en.wikipedia.org/wiki/Help:Wikitext) is no joke.

It is among the [most-curious](https://twitter.com/ftrain/status/1036060636587978753) and [ad-hoc](https://en.wikipedia.org/wiki/Wikipedia_talk:Times_that_100_Wikipedians_supported_something) data-formats you'll ever find.

Consider:

- _the partial-implementation of [inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),_
- _deep recursion of [similar-syntax](https://en.wikipedia.org/wiki/Wikipedia:Database_reports/Templates_transcluded_on_the_most_pages) templates,_
- _nested elements do not honour the scope of other elements_
- _the language has no errors_
- _the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax)_
- _['Birth_date_and_age'](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) vs ['Birth-date_and_age'](https://en.wikipedia.org/wiki/Template:Birth-date_and_age)._
- _the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) for image paths,_
- _the [custom encoding](<https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical*restrictions)>) of whitespace and punctuation,*
- _[right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates._
- _[PEG-based](https://pegjs.org/) parsers struggle with wikitext's backtracking/lookarounds_
- _there are [634,755](https://s3-us-west-1.amazonaws.com/spencer-scratch/allTemplates-2018-10-26.tsv) templates in en-wikipedia (as of Nov-2018)_

Also, there are a large number of pages that don't render properly on wikipedia.

this library supports many **_recursive shenanigans_**, depreciated and **obscure template** variants, and illicit **wiki-shorthands**.

### What it does:

- Detects and parses **redirects** and **disambiguation** pages
- Parse **infoboxes** into a formatted key-value object
- Handles recursive templates and links- like [[.. [[...]] ]]
- **_Per-sentence_** plaintext and link resolution
- Parse and format internal links
- creates
  [image thumbnail urls](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F)
  from **File:XYZ.png** filenames
- Properly resolve dynamic templates like _{{CURRENTMONTH}}_ and _{{CONVERT ..}}_
- Parse **images**, **headings**, and **categories**
- converts 'DMS-formatted' **_(59°12\'7.7"N)_** geo-coordinates to lat/lng
- parse and combine citation and reference metadata
- Eliminate xml, latex, css, and table-sorting cruft

### What doesn't do:

- external '[transcluded](https://en.wikipedia.org/wiki/Wikipedia:Transclusion)' page data [[1](https://github.com/spencermountain/wtf_wikipedia/issues/223)]
- **AST** output
- smart (or 'pretty') formatting of html in infoboxes or galleries [[1](https://github.com/spencermountain/wtf_wikipedia/issues/173)]
- maintain perfect page order [[1]](https://github.com/spencermountain/wtf_wikipedia/issues/88)
- per-sentence references (by 'section' element instead)
- maintain template or infobox css styling

It is built to be as flexible as possible. In all cases, tries to fail in considerate ways.

---

### what about html scraping..

Wikimedia's [official parser](https://www.mediawiki.org/wiki/Parsoid) turns wikitext ➔ HTML.
You can even get html from the api [like this](https://en.wikipedia.org/w/api.php?format=json&origin=*&action=parse&prop=text&page=Whistling).

if you prefer this **_screen-scraping_** workflow, you can pluck parts of a page [like that](https://observablehq.com/@mbostock/working-with-wikipedia-data).

that's cool, too!

getting structured data this way is still a complex + weird process.
Spelunking the html is usually just as tricky and error-prone as scanning the wikitext itself.

The contributors to this library have come to that conclusion, [as many others have](https://www.mediawiki.org/wiki/Alternative_parsers).

This library has _lovingly borrowed_ a lot of code and data from the parsoid project, and is gracious to its contributors.

<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## ok, enough chat.

flip your wikimedia markup into a `Document` object

```javascript
import wtf from 'wtf_wikipedia'

let txt = `
==Wood in Popular Culture==
* harry potter's wand
* the simpsons fence
`
wtf(txt)
// Document {text(), json(), lists()...}
```

### **doc.links()**

```javascript
let str = `Whistling is featured in a number of television shows, such as [[Lassie (1954 TV series)|''Lassie'']], and the title theme for ''[[The X-Files]]''.`
let doc = wtf(str)
doc.links().map(l => l.page())
// [ 'Lassie (1954 TV series)',  'The X-Files' ]
```

### **doc.text()**

returns nice plain-text of the article

```js
var wiki =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>"
var text = wtf(wiki).text()
//"Boston's baseball field has a 37ft wall."
```

#### **doc.sections()**:

a section (heading?) )is _== Like This ==_

```js
wtf(page)
  .sections(1)
  .children() //traverse nested sections
wtf(page)
  .sections('see also')
  .remove() //delete one
```

#### Sentence data:

```js
s = wtf(page).sentences(4)
s.links()
s.bolds()
s.italics()
s.dates() //structured date templates
```

#### Images

```js
img = wtf(page).images(0)
img.url() // the full-size wikimedia-hosted url
img.thumbnail() // 300px, by default
img.format() // jpg, png, ..
```

## Fetch

This library can grab, and automatically-parse articles from [any wikimedia api](https://www.mediawiki.org/wiki/API:Main_page).
This includes any language, any wiki-project, and most 3rd-party wikis.

```js
// 3rd-party wiki
let doc = await wtf.fetch('https://muppet.fandom.com/wiki/Miss_Piggy')

// wikipedia français
doc = await wtf.fetch('Tony Hawk', 'fr')
doc.sentences(0).text() // 'Tony Hawk est un skateboarder professionnel et un acteur ...'

// accept an array, or wikimedia pageIDs
let docs = wtf.fetch(['Whistling', 2983], { follow_redirects: false })

// article from german wikivoyage
wtf.fetch('Toronto', { lang: 'de', wiki: 'wikivoyage' }).then(doc => {
  console.log(doc.sentences(0).text()) // 'Toronto ist die Hauptstadt der Provinz Ontario'
})
```

you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
let doc = await wtf.fetch(64646, 'de')
```

the fetch method follows redirects.

### Category fetch

**wtf.category(title, [lang], [options | callback])**
retrieves all pages and sub-categories belonging to a given category:

```js
let result = await wtf.category('Category:Politicians_from_Paris')
//{
//  pages: [{title: 'Paul Bacon', pageid: 1266127 }, ...],
//  categories: [ {title: 'Category:Mayors of Paris' } ]
//}
```

### Random article

**wtf.random(title, [lang], [options | callback])**
retrieves all pages and sub-categories belonging to a given category:

```js
let result = await wtf.category('Category:Politicians_from_Paris')
//{
//  pages: [{title: 'Paul Bacon', pageid: 1266127 }, ...],
//  categories: [ {title: 'Category:Mayors of Paris' } ]
//}
```

### Good practice:

The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things, if you're going to hit it heavily -

- pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
- bundle multiple pages into one request as an array (say, groups of 5?)
- run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).

```js
wtf
  .fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
    'Api-User-Agent': 'spencermountain@gmail.com'
  })
  .then(docList => {
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

- [wtf-plugin-html](https://github.com/spencermountain/wtf-plugin-html)
- [wtf-plugin-markdown](https://github.com/spencermountain/wtf-plugin-markdown)
- [wtf-plugin-latex](https://github.com/spencermountain/wtf-plugin-latex)
- [wtf-plugin-wikitext](https://github.com/spencermountain/wtf-plugin-wikitext)
- [wtf-mlb](https://github.com/spencermountain/wtf-mlb) - baseball team/season parser
- [wtf-nhl](https://github.com/spencermountain/wtf-nhl) - hockey team/season parser

## Tutorials

- [Tutorial 1](https://observablehq.com/@spencermountain/wtf_wikipedia-tutorial?collection=@spencermountain/wtf_wikipedia) - getting NBA data
- [Parsing COVID outbreak table](https://observablehq.com/@spencermountain/parsing-wikipedias-coronavirus-outbreak-data?collection=@spencermountain/wtf_wikipedia)
- [MBL season schedules](https://observablehq.com/@spencermountain/wikipedia-baseball-table-parser?collection=@spencermountain/wtf_wikipedia)

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## API

- **.title()** - guess the title of the page from the first-sentence
- **.isRedirect()** - if the page is just a redirect to another page
- **.redirectTo()** - the page this redirects to
- **.isDisambiguation()** - is this a placeholder page to direct you to one-of-many possible pages
- **.categories()** -
- **.sections()** - return a list, or given-index of the Document's sections
- **.paragraphs()** - return a list, or given-index of Paragraphs, in all sections
- **.sentences()** - return a list, or given-index of all sentences in the document
- **.images()** -
- **.links()** - return a list, or given-index of all links, in all parts of the document
- **.lists()** - sections in a page where each line begins with a bullet point
- **.tables()** - return a list, or given-index of all structured tables in the document
- **.templates()** - any type of structured-data elements, typically wrapped in like {{this}}
- **.infoboxes()** - specific type of template, that appear on the top-right of the page
- **.references()** - return a list, or given-index of 'citations' in the document
- **.coordinates()** - geo-locations that appear on the page
- **.text()** - plaintext, human-readable output for the page
- **.json()** - a 'stringifyable' output of the page's main data

### Section

- **.title()** - the name of the section, between ==these tags==
- **.index()** - which number section is this, in the whole document.
- **.indentation()** - how many steps deep into the table of contents it is
- **.sentences()** - return a list, or given-index, of sentences in this section
- **.paragraphs()** - return a list, or given-index, of paragraphs in this section
- **.links()** -
- **.tables()** -
- **.templates()** -
- **.infoboxes()** -
- **.coordinates()** -
- **.lists()** -
- **.interwiki()** - any links to other language wikis
- **.images()** - return a list, or given index, of any images in this section
- **.references()** - return a list, or given index, of 'citations' in this section
- **.remove()** - remove the current section from the document
- **.nextSibling()** - a section following this one, under the current parent: eg. 1920s → 1930s
- **.lastSibling()** - a section before this one, under the current parent: eg. 1930s → 1920s
- **.children()** - any sections more specific than this one: eg. History → [PreHistory, 1920s, 1930s]
- **.parent()** - the section, broader than this one: eg. 1920s → History
- **.text()** -
- **.json()** -

### Paragraph

- **.sentences()** -
- **.references()** -
- **.lists()** -
- **.images()** -
- **.links()** -
- **.interwiki()** -
- **.text()** - generate readable plaintext for this paragraph
- **.json()** - generate some generic data for this paragraph in JSON format

### Sentence

- **.links()** -
- **.bolds()** -
- **.italics()** -
- **.dates()** -
- **.json()** -

### Image

- **.links()** -
- **.thumbnail()** -
- **.format()** -
- **.json()** - return some generic metadata for this image
- **.text()** - does nothing

### Infobox

- **.links()** -
- **.keyValue()** - generate simple key:value strings from this infobox
- **.image()** - grab the main image from this infobox
- **.get()** - lookup properties from their key
- **.template()** - which infobox, eg 'Infobox Person'
- **.text()** - generate readable plaintext for this infobox
- **.json()** - generate some generic 'stringifyable' data for this infobox

### List

- **.lines()** - get an array of each member of the list
- **.links()** - get all links mentioned in this list
- **.text()** - generate readable plaintext for this list
- **.json()** - generate some generic easily-parsable data for this list

### Reference

- **.title()** - generate human-facing text for this reference
- **.links()** - get any links mentioned in this reference
- **.text()** - returns nothing
- **.json()** - generate some generic metadata data for this reference

### Table

- **.links()** - get any links mentioned in this table
- **.keyValue()** - generate a simple list of key:value objects for this table
- **.text()** - returns nothing
- **.json()** - generate some useful metadata data for this table

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
    data.templates.push({ name: 'foo', cool: true })
    return 'new-text'
  }
  // array-syntax allows easy-labeling of parameters
  templates.foo = ['a', 'b', 'c']
  // number-syntax for returning by param # '{{name|zero|one|two}}'
  templates.baz = 0
  // replace the template with a string '{{asterisk}}' -> '*'
  templates.asterisk = '*'
})
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## Performance:

Using [dumpster-dive](https://github.com/spencermountain/dumpster-dive), this library can parse a full english wikipedia in around 4 hours.
That's about 100 pages/second, per thread.

## See also:

- [instaview](https://github.com/cscott/instaview) - javascript
- [txtwiki](https://github.com/joaomsa/txtwiki.js) - javascript
- [Parsoid](https://www.mediawiki.org/wiki/Parsoid) - javascript
- [wiky](https://github.com/Gozala/wiky) - javascript
- [sweble-wikitext](https://github.com/sweble/sweble-wikitext) - java
- [kiwi](https://github.com/aboutus/kiwi/) - C
- [parse_wiki_text](https://docs.rs/parse_wiki_text/) - rust
- [wikitext-perl](https://metacpan.org/pod/distribution/wikitext-perl/lib/Text/WikiText.pm) - perl
- [wikiextractor](https://github.com/attardi/wikiextractor) - python
- [wikitextparser](https://pypi.org/project/wikitextparser) - python

and [many more](https://www.mediawiki.org/wiki/Alternative_parsers)!

MIT
