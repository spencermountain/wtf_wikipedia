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
  <a href="https://bundlephobia.com/result?p=wtf_wikipedia">
    <img src="https://img.shields.io/bundlephobia/min/wtf_wikipedia" />
  </a>
  </div>
</div>

<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="left">
  <img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  <img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  it is <a href="https://osr.cs.fau.de/wp-content/uploads/2017/09/wikitext-parser.pdf">very</a>, <a href="https://utcc.utoronto.ca/~cks/space/blog/programming/ParsingWikitext">very</a> hard.  &nbsp;  &nbsp; 
  <span> &nbsp;  &nbsp; we're <a href="https://en.wikipedia.org/wiki/Wikipedia_talk:Times_that_100_Wikipedians_supported_something">not</a> <a href="https://twitter.com/ftrain/status/1036060636587978753">joking</a>.</span>
</div>

<!-- einstein sentence -->
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/43598341-75ca8f94-9652-11e8-9b91-cabae4fb1dce.png"/>
</div>

<div align="center">
<img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>

<div >
  why do we always do this?
  <br/>
  <img height="30px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
  we put our information where we can't take it out.

</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

```js
import wtf from 'wtf_wikipedia'

let doc = await wtf.fetch('Toronto Raptors')
let coach = doc.infobox().get('coach')
coach.text() //'Darko Rajaković'
```

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>
<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## .text()

get clean plaintext:

```js
let str = `[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall. <ref>Field of our Fathers: By Richard Johnson</ref>`
wtf(str).text()
// "Boston's baseball field has a 37ft wall."
```

```js
let doc = await wtf.fetch('Glastonbury', 'en')
doc.sentences()[0].text()
// 'Glastonbury is a town and civil parish in Somerset, England, situated at a dry point ...'
```

<div align="right">
  <a href="https://observablehq.com/@spencermountain/wtf-wikipedia-text">.text() docs</a>
</div>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221837-0d142480-ffb8-11e9-9d30-90669f1b897c.png"/>
</div>

## .json()

get all the data from a page:

```js
let doc = await wtf.fetch('Whistling')

doc.json()
// { categories: ['Oral communication', 'Vocal skills'], sections: [{ title: 'Techniques' }], ...}
```

the default .json() output is _[really verbose](https://observablehq.com/@spencermountain/wtf-wikipedia-json)_, but you can cherry-pick data by poking-around like this:

```js
// get just the links:
doc.links().map((link) => link.json())
//[{ page: 'Theatrical superstitions', text: 'supersitions' }]

// just the images:
doc.images()[0].json()
// { file: 'Image:Duveneck Whistling Boy.jpg', url: 'https://commons.wiki...' }

// json for a particular section:
doc.section('see also').links()[0].json()
// { page: 'Slide Whistle' }
```

<div align="right">
  <a href="https://observablehq.com/@spencermountain/wtf-wikipedia-json">.json() docs</a>
</div>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

run it on the client-side:

```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script>
  wtf.fetch('Radiohead', { 'Api-User-Agent': 'Name your script here' }, function (err, doc) {
    let members = doc.infobox().get('current members')
    members.links().map((l) => l.page())
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  })
</script>
```

or the server-side:

```js
import wtf from 'wtf_wikipedia'
// or,
const wtf = require('wtf_wikipedia')
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221837-0d142480-ffb8-11e9-9d30-90669f1b897c.png"/>
</div>

## full wikipedia dumps

With this library, in conjunction with [dumpster-dive](https://github.com/spencermountain/dumpster-dive), you can parse the whole english wikipedia in an aftertoon.

```bash
npm install -g dumpster-dive
```

<img height="280px" src="https://user-images.githubusercontent.com/399657/40262198-a268b95a-5ad3-11e8-86ef-29c2347eec81.gif"/>

<div align="right">
  <a href="https://github.com/spencermountain/dumpster-dive/">dumpster docs</a>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

### Ok first, 🛀

[Wikitext](https://en.wikipedia.org/wiki/Help:Wikitext) is no small thing.

Consider:

- _the partial-implementation of [inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),_
- _nested elements do not honour the scope of other elements_
- _the language has no errors_
- _deep recursion of [similar-syntax](https://en.wikipedia.org/wiki/Wikipedia:Database_reports/Templates_transcluded_on_the_most_pages) templates_
- _the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax)_
- _['Birth_date_and_age'](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) vs ['Birth-date_and_age'](https://en.wikipedia.org/wiki/Template:Birth-date_and_age)_
- _the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) for image paths_
- _the [custom encoding](https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions) of whitespace and punctuation_
- _[right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates_
- _[PEG-based](https://pegjs.org/) parsers struggle with wikitext's backtracking/lookarounds_
- _there are [634,755](https://s3-us-west-1.amazonaws.com/spencer-scratch/allTemplates-2018-10-26.tsv) templates in en-wikipedia (as of Nov-2018)_
- _there are a large number of pages that don't render properly on wikipedia, or its apps.._

this library supports many **_recursive shenanigans_**, depreciated and **obscure template** variants, and illicit **wiki-shorthands**.

#### What it does:

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

#### What doesn't do:

- external '[transcluded](https://en.wikipedia.org/wiki/Wikipedia:Transclusion)' page data [[1](https://github.com/spencermountain/wtf_wikipedia/issues/223)]
- **AST** output
- smart (or 'pretty') formatting of html in infoboxes or galleries [[1](https://github.com/spencermountain/wtf_wikipedia/issues/173)]
- maintain perfect page order [[1]](https://github.com/spencermountain/wtf_wikipedia/issues/88)
- per-sentence references (by 'section' element instead)
- maintain template or infobox css styling
- large tables that span different sections [[1](https://github.com/spencermountain/wtf_wikipedia/issues/372)]

It is built to be as flexible as possible. In all cases, tries to fail in considerate ways.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

#### How about html scraping..?

Wikimedia's [official parser](https://www.mediawiki.org/wiki/Parsoid) turns wikitext ➔ HTML.

<!-- You can even get html from the api [like this](https://en.wikipedia.org/w/api.php?format=json&origin=*&action=parse&prop=text&page=Whistling). -->

if you prefer this **_screen-scraping_** workflow, you can pluck at parts of a page [like that](https://observablehq.com/@mbostock/working-with-wikipedia-data).

that's cool!

getting structured data this way is still a complex, weird process.
Manually _spelunking_ the html is sometimes just as tricky and error-prone as scanning the wikitext itself.

The contributors to this library have come to that conclusion, [as many others have](https://www.mediawiki.org/wiki/Alternative_parsers).

This library is gracious to the Parsoid contributors.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

#### okay,

flip your wikitext into a Doc object

```javascript
import wtf from 'wtf_wikipedia'

let txt = `
==Wood in Popular Culture==
* Harry Potter's wand
* The Simpson's fence
`
wtf(txt)
// Document {text(), json(), lists()...}
```

#### **doc.links()**

```javascript
let txt = `Whistling is featured in a number of television shows, such as [[Lassie (1954 TV series)|''Lassie'']], and the title theme for ''[[The X-Files]]''.`
wtf(txt)
  .links()
  .map((l) => l.page())
// [ 'Lassie (1954 TV series)',  'The X-Files' ]
```

#### **doc.text()**

returns nice plain-text of the article

```js
let txt =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>"
wtf(txt).text()
//"Boston's baseball field has a 37ft wall."
```

#### **doc.sections()**:

a section is a heading _'==Like This=='_

```js
wtf(page).sections()[1].children() //traverse nested sections
wtf(page).section('see also').remove() //delete one
```

#### **doc.sentences()**

```js
let s = wtf(page).sentences()[4]
s.links()
s.bolds()
s.italics()
s.text()
s.wikitext()
```

#### **doc.categories()**

```js
await wtf.fetch('Whistling').categories()
//['Oral communication', 'Vocal music', 'Vocal skills']
```

#### **doc.images()**

```js
let img = wtf(page).images()[0]
img.url() // the full-size wikimedia-hosted url
img.thumbnail() // 300px, by default
img.format() // jpg, png, ..
```

<!-- spacer -->
<img height="15px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Fetch

You can grab and parse articles from _[any wiki api](https://www.mediawiki.org/wiki/API:Main_page)_.
This includes any language, any wiki-project, and most **3rd-party wikis**.

```js
// 3rd-party wiki
let doc = await wtf.fetch('https://muppet.fandom.com/wiki/Miss_Piggy')

// wikipedia français
doc = await wtf.fetch('Tony Hawk', 'fr')
doc.sentence().text() // 'Tony Hplawk est un skateboarder professionnel et un acteur ...'

// accept an array, or wikimedia pageIDs
let docs = wtf.fetch(['Whistling', 2983], { follow_redirects: false })

// article from german wikivoyage
wtf.fetch('Toronto', { lang: 'de', wiki: 'wikivoyage' }).then((doc) => {
  console.log(doc.sentences()[0].text()) // 'Toronto ist die Hauptstadt der Provinz Ontario'
})
```

you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
let doc = await wtf.fetch(64646, 'de')
```

the fetch method follows redirects.

### API plugin

**wtf.getCategoryPages(title, [options])**

retrieves all pages and sub-categories belonging to a given category:

```js
wtf.extend(require('wtf-plugin-api'))
let result = await wtf.getCategoryPages('Category:Politicians_from_Paris')
/*
{
  [
    {"pageid":52502362,"ns":0,"title":"William Abitbol"},
    {"pageid":50101413,"ns":0,"title":"Marie-Joseph Charles des Acres de L'Aigle"}
    ...
    {"pageid":62721979,"ns":14,"title":"Category:Councillors of Paris"},
    {"pageid":856891,"ns":14,"title":"Category:Mayors of Paris"}
  ]
}
*/
```

**wtf.random([options])**

fetches a random wikipedia article, from a given language or domain

```js
wtf.extend(require('wtf-plugin-api'))
wtf.random().then((doc) => {
  console.log(doc.title(), doc.categories())
  //'Whistling'  ['Oral communication', 'Vocal skills']
})
```

see [wtf-plugin-api](./plugins/api)

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Tutorials

- [Gentle Introduction](https://observablehq.com/@spencermountain/wtf_wikipedia-tutorial?collection=@spencermountain/wtf_wikipedia) - Getting NBA Team data
- [Parsing tables](https://observablehq.com/@spencermountain/parsing-wikipedia-tables) - getting all Apollo Astronauts as JSON
- [Parsing Timezones](https://observablehq.com/@spencermountain/parsing-timezones-from-wikipedia)
- [MBL season schedules](https://observablehq.com/@spencermountain/wikipedia-baseball-table-parser?collection=@spencermountain/wtf_wikipedia)
- [Fetching a list of pages](https://observablehq.com/@spencermountain/parsing-a-list-of-wikipedia-articles)
- [Parsing COVID outbreak table](https://observablehq.com/@spencermountain/parsing-wikipedias-coronavirus-outbreak-data?collection=@spencermountain/wtf_wikipedia)

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## Plugins

these add all sorts of new functionality:

```js
wtf.extend(require('wtf-plugin-classify'))
await wtf.fetch('Toronto Raptors').classify()
// 'Organization/SportsTeam'

wtf.extend(require('wtf-plugin-summary'))
await wtf.fetch('Pulp Fiction').summary()
// 'a 1994 American crime film'

wtf.extend(require('wtf-plugin-person'))
await wtf.fetch('David Bowie').birthDate()
// {year:1947, date:8, month:1}

wtf.extend(require('wtf-plugin-i18n'))
await wtf.fetch('Ziggy Stardust', 'fr').infobox().json()
// {nom:{text:"Ziggy Stardust"}, oeuvre:{text:"The Rise and Fall of Ziggy Stardust"}}
```

| **Plugin**                                                 |                                         |
| ---------------------------------------------------------- | --------------------------------------- |
| [classify](./plugins/classify)                             | person/place/thing                      |
| [summary](./plugins/summary)                               | short description text                  |
| [person](./plugins/person)                                 | birth/death information                 |
| [api](./plugins/api)                                       | fetch more data from the API            |
| [i18n](./plugins/i18n)                                     | improves multilingual template coverage |
| [wtf-mlb](https://github.com/spencermountain/wtf-mlb)      | fetch baseball data                     |
| [wtf-nhl](https://github.com/spencermountain/wtf-nhl)      | fetch hockey data                       |
| [nsfw](https://github.com/spencermountain/wtf-plugin-nsfw) | flag sexual/graphic/adult articles      |
| [image](./plugins/image)                                   | additional methods for `.images()`      |
| [html](./plugins/html)                                     | output html                             |
| [wikitext](./plugins/wikitext)                             | output wikitext                         |
| [markdown](./plugins/markdown)                             | output markdown                         |
| [latex](./plugins/latex)                                   | output latex                            |

<div align="right">
  <a href="https://observablehq.com/@spencermountain/wtf-wikipedia-plugins">plugin docs</a>
</div>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

### Good practice:

The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things, if you're going to hit it heavily -

- pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
- bundle multiple pages into one request as an array (say, groups of 5?)
- run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).

```js
wtf
  .fetch(['Royal Cinema', 'Aldous Huxley'], {
    lang: 'en',
    'Api-User-Agent': 'spencermountain@gmail.com',
  })
  .then((docList) => {
    let links = docList.map((doc) => doc.links())
    console.log(links)
  })
```

---

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Full API

- **.title()** - get/set the title of the page from the first-sentence
- **.pageID()** - get/set the wikimedia id of the page, if we have it.
- **.wikidata()** - get/set the wikidata id of the page, if we have it.
- **.domain()** - get/set the domain of the wiki we're on, if we have it.
- **.url()** - (try to) generate the url for the current article
- **.lang()** - get/set the current language (used for url method)
- **.namespace()** - get/set the wikimedia namespace of the page, if we have it
- **.isRedirect()** - if the page is just a redirect to another page
- **.redirectTo()** - the page this redirects to
- **.isDisambiguation()** - is this a placeholder page to direct you to one-of-many possible pages
- **.isStub()** - if the page is flagged as incomplete
- **.categories()** - return all categories of the document
- **.sections()** - return a list of the Document's sections
- **.paragraphs()** - return a list of Paragraphs, in all sections
- **.sentences()** - return a list of all sentences in the document
- **.images()** - return all images found in the document
- **.links()** - return a list of all links, in all parts of the document
- **.lists()** - sections in a page where each line begins with a bullet point
- **.tables()** - return a list of all structured tables in the document
- **.templates()** - any type of structured-data elements, typically wrapped in like {{this}}
- **.infoboxes()** - specific type of template, that appear on the top-right of the page
- **.references()** - return a list of 'citations' in the document
- **.coordinates()** - geo-locations that appear on the page
- **.text()** - plaintext, human-readable output for the page
- **.json()** - a 'stringifyable' output of the page's main data
- **.wikitext()** - original wiki markup
- **.description()** - get/set the page's short description, if we have one.
- **.pageImage()** - get/set the page's representative image, if we have one.
- **.revisionID()** - get/set the latest edit id of the page, if we have it.
- **.timestamp()** - get/set the time of the most recent edit of the page, if we have it.

### Section

- **.title()** - the name of the section, between ==these tags==
- **.index()** - which number section is this, in the whole document.
- **.indentation()** - how many steps deep into the table of contents it is
- **.sentences()** - return a list of sentences in this section
- **.paragraphs()** - return a list of paragraphs in this section
- **.links()** - list of all links, in all paragraphs and templates
- **.tables()** - list of all html tables
- **.templates()** - list of all templates in this section
- **.infoboxes()** - list of all infoboxes found in this section
- **.coordinates()** - list of all coordinate templates found in this section
- **.lists()** - list of all lists in this section
- **.interwiki()** - any links to other language wikis
- **.images()** - return a list of any images in this section
- **.references()** - return a list of 'citations' in this section
- **.remove()** - remove the current section from the document
- **.nextSibling()** - a section following this one, under the current parent: eg. 1920s → 1930s
- **.lastSibling()** - a section before this one, under the current parent: eg. 1930s → 1920s
- **.children()** - any sections more specific than this one: eg. History → [PreHistory, 1920s, 1930s]
- **.parent()** - the section, broader than this one: eg. 1920s → History
- **.text()** - readable plaintext for this section
- **.json()** - return all section data
- **.wikitext()** - original wiki markup

### Paragraph

- **.sentences()** - return a list of sentence objects in this paragraph
- **.references()** - any citations, or references in all sentences
- **.lists()** - any lists found in this paragraph
- **.images()** - any images found in this paragraph
- **.links()** - list of all links in all sentences
- **.interwiki()** - any links to other language wikis
- **.text()** - generate readable plaintext for this paragraph
- **.json()** - generate some generic data for this paragraph in JSON format
- **.wikitext()** - original wiki markup

### Sentence

- **.links()** - list of all links
- **.bolds()** - list of all bold texts
- **.italics()** - list of all italic formatted text
- **.text()** - generate readable plaintext
- **.json()** - return all sentence data
- **.wikitext()** - original wiki markup

### Image

- **.url()** - return url to full size image
- **.thumbnail()** - return url to thumbnail (pass `size` to customize)
- **.links()** - any links from the caption (if present)
- **.format()** - get file format (e.g. `jpg`)
- **.text()** - does nothing
- **.json()** - return some generic metadata for this image
- **.wikitext()** - original wiki markup

### Template

- **.text()** - does this template generate any readable plaintext?
- **.json()** - get all the data for this template
- **.wikitext()** - original wiki markup

### Infobox

- **.links()** - any internal or external links in this infobox
- **.keyValue()** - generate simple key:value strings from this infobox
- **.image()** - grab the main image from this infobox
- **.get()** - lookup properties from their key
- **.template()** - which infobox, eg 'Infobox Person'
- **.text()** - generate readable plaintext for this infobox
- **.json()** - generate some generic 'stringifyable' data for this infobox
- **.wikitext()** - original wiki markup

### List

- **.lines()** - get an array of each member of the list
- **.links()** - get all links mentioned in this list
- **.text()** - generate readable plaintext for this list
- **.json()** - generate some generic easily-parsable data for this list
- **.wikitext()** - original wiki markup

### Reference

- **.title()** - generate human-facing text for this reference
- **.links()** - get any links mentioned in this reference
- **.text()** - returns nothing
- **.json()** - generate some generic metadata data for this reference
- **.wikitext()** - original wiki markup

### Table

- **.links()** - get any links mentioned in this table
- **.keyValue()** - generate a simple list of key:value objects for this table
- **.text()** - returns nothing
- **.json()** - generate some useful metadata data for this table
- **.wikitext()** - original wiki markup

<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## Configuration

### Adding new methods:

you can add new methods to any class of the library, with `wtf.extend()`

```js
wtf.extend((models) => {
  // throw this method in there...
  models.Doc.prototype.isPerson = function () {
    return this.categories().find((cat) => cat.match(/people/))
  }
})

await wtf.fetch('Stephen Harper').isPerson()
```

### Adding new templates:

does your wiki use a `{{foo}}` template? Add a custom parser for it:

```js
wtf.extend((models, templates) => {
  // create a custom parser function
  templates.foo = (tmpl, list, parse) => {
    let obj = parse(tmpl) //or do a custom regex
    list.push(obj)
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

by default, if there's no parser for a template, it will be just ignored and generate an empty string.
However, it's possible to configure a fallback parser function to handle these templates:

```js
wtf('some {{weird_template}} here', {
  templateFallbackFn: (tmpl, list, parse) => {
    let obj = parse(tmpl) //or do a custom regex
    list.push(obj)
    return '[unsupported template]' // or return null to ignore this template
  },
})
```

you can determine which templates are understood to be 'infoboxes' with the 3rd parameter:

```js
wtf.extend((models, templates, infoboxes) => {
  Object.assign(infoboxes, { person: true, place: true, thing: true })
})
```

<div align="right">
  <a href="https://observablehq.com/@spencermountain/wtf-wikipedia-plugins">plugin docs</a>
</div>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## Notes:

### 3rd-party wikis

by default, [a public API](https://www.mediawiki.org/wiki/API:Main_page) is provided by a installed mediawiki application.
This means that most wikis have an open api, even if they don't realize it. Some wikis may turn this feature off.

It can usually be found by visiting `http://mywiki.com/api.php`

to fetch pages from a 3rd-party wiki:

```js
wtf.fetch('Kermit', { domain: 'muppet.fandom.com' }).then((doc) => {
  console.log(doc.text())
})
```

some wikis will change the path of their API, from `./api.php` to elsewhere. If your api has a different path, you can set it like so:

```js
wtf.fetch('2016-06-04_-_J.Fernandes_@_FIL,_Lisbon', { domain: 'www.mixesdb.com', path: 'db/api.php' }).then((doc) => {
  console.log(doc.template('player').json())
})
```

for image-urls to work properly, the wiki should also have `Special:Redirect` enabled.
Some wikis, (like wikia) have intentionally disabled this.

### i18n and multi-language:

wikitext is (amazingly) used across all languages, wikis, and even in right-to-left languages.
This parser actually does an okay job at it too.

Wikipedia I18n language information for _Redirects, Infoboxes, Categories, and Images_ are included in the library, with pretty-decent coverage.

To improve coverage of i18n templates, use [wtf-plugin-i18n](./plugins/i18n)

Please make a PR if you see something missing for your language.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Builds:

this library ships separate client-side and server-side builds, to preserve filesize.

- _[./wtf_wikipedia-client.mjs](./builds/wtf_wikipedia-client.mjs)_ - as es-module (or Deno)
- _[./wtf_wikipedia-client.min.js](./builds/wtf_wikipedia-client.min.js)_ - for production

- _[./wtf_wikipedia.cjs](./builds/wtf_wikipedia.cjs)_ - node commonjs build
- _[./wtf_wikipedia.mjs](./builds/wtf_wikipedia.mjs)_ - node/deno/typescript esm build

the browser version uses `fetch()` and the server version uses `require('https')`.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Performance:

It is not the fastest parser, and is very unlikely to beat a [single-pass parser](https://www.mediawiki.org/wiki/Alternative_parsers) in C or Java.

Using [dumpster-dive](https://github.com/spencermountain/dumpster-dive), this library can parse a full english wikipedia in around 4 hours on a macbook.

That's about 100 pages/second, per thread.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## See also:

Other alternative javascript parsers:

- [instaview](https://github.com/cscott/instaview)
- [txtwiki](https://github.com/joaomsa/txtwiki.js)
- [Parsoid](https://www.mediawiki.org/wiki/Parsoid)
- [wiky](https://github.com/Gozala/wiky)

and [many more](https://www.mediawiki.org/wiki/Alternative_parsers)!

MIT
