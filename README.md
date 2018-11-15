<div align="center">
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/grade/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <a href="https://npmjs.org/package/wtf_wikipedia">
    <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
  </a>
  <a href="https://codecov.io/gh/spencermountain/wtf_wikipedia">
    <img src="https://codecov.io/gh/spencermountain/wtf_wikipedia/branch/master/graph/badge.svg" />
  </a>
  <div>wikipedia markup parser</div>
  <sub>
    by
    <a href="https://spencermountain.github.io/">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  <b>wtf_wikipedia</b> turns wikipedia's markup language into <b>JSON</b>,
  <div>so getting data from wikipedia is easier.</div>

  <h2 align="center">🏠 Try to have a good time. 🛀 </h2>
  <div><sup>seriously,</sup></div>
  this is among the <i>most-curious</i> data formats you can find.
</div>

<div align="center"><sup><i>(then we buried our human-record in it)</i></sup></div>

Consider:
* the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax)
* ['Birth_date_and_age'](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) vs ['Birth-date_and_age'](https://en.wikipedia.org/wiki/Template:Birth-date_and_age).
* the partial-implementation of [inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),
* deep recursion of [similar-syntax](https://en.wikipedia.org/wiki/Wikipedia:Database_reports/Templates_transcluded_on_the_most_pages) templates,
* the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) for image paths,
* the [custom encoding](https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical_restrictions)) of whitespace and punctuation,
* [right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates.

**wtf_wikipedia** supports many ***recursive shenanigans***, depreciated and **obscure template**
variants, and illicit 'wiki-esque' shorthands.

![image](https://user-images.githubusercontent.com/399657/43598341-75ca8f94-9652-11e8-9b91-cabae4fb1dce.png)

It will try it's best, and fail in reasonable ways.

> → building your own parser is never a good idea →
>
> ← but this library aims to be *****a straight-forward***** way to get data ***out of wikipedia***

<div align="center">
  <sub>
    <i>... so don't be mad at me,</i>
    <a href="https://en.wikipedia.org/wiki/Wikipedia_talk:Times_that_100_Wikipedians_supported_something">
      be mad at this.
    </a>
  </sub>
</div>
<div align="center">
  <h3><a href="https://beta.observablehq.com/@spencermountain/wtf_wikipedia">Demo</a></h3>
</div>

## well ok then,
<kbd>npm install wtf_wikipedia</kbd>

```javascript
var wtf = require('wtf_wikipedia');

wtf.fetch('Whistling').then(doc => {

  doc.categories();
  //['Oral communication', 'Vocal music', 'Vocal skills']

  doc.sections('As communication').text();
  // 'A traditional whistled language named Silbo Gomero..'

  doc.images(0).thumb();
  // 'https://upload.wikimedia.org..../300px-Duveneck_Whistling_Boy.jpg'

  doc.sections('See Also').links().map(link => link.page)
  //['Slide whistle', 'Hand flute', 'Bird vocalization'...]
});
```
***on the client-side:***
```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  //(follows redirect)
  wtf.fetch('On a Friday', 'en', function(err, doc) {
    var val = doc.infobox(0).get('current_members');
    val.links().map(link => link.page);
    //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
  });
</script>
```

# What it does:
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

## But what about...

### Parsoid:
Wikimedia's [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid) is the official wikiscript parser. It
reliably turns wikiscript into HTML, but not valid XML.

To use it for data-mining, you'll need to:
```
parsoid(wikiText) -> [headless/pretend-DOM] -> screen-scraping
```
which is fine,

but getting structured data this way (say, ***sentences*** or ***infobox values***), is still a complex + weird process. Arguably, you're not  any closer than you were with wikitext.
This library has ***lovingly ❤️*** borrowed a lot of code and data from the parsoid project, and thanks its contributors.

### Full data-dumps:
wtf_wikipedia was built to work with [dumpster-dive](https://github.com/spencermountain/dumpster-dive),
which lets you parse a whole wikipedia dump on a laptop in a couple hours. It's definitely the way to go, instead of fetching many pages off the api.

# API
```js
const wtf = require('wtf_wikipedia')
//parse a page
var doc = wtf(wikiText, [options])

//fetch & parse a page - wtf.fetch(title, [lang_or_wikiid], [options], [callback])
(async () => {
  var doc = await wtf.fetch('Toronto');
  console.log(doc.text())
})();

//(callback format works too)
wtf.fetch(64646, 'en', (err, doc) => {
  console.log(doc.categories());
});
```

<div align="center">
  <h3><a href="https://beta.observablehq.com/@spencermountain/wtf_wikipedia-api">Full API</a></h3>
</div>

#### Main parts:
```
Document            - the whole thing
  - Category
  - Coordinate

  Section           - page headings ( ==these== )
    - Infobox       - a main, key-value template
    - Table         -
    - Reference     - citations, all-forms
    - Template      - any other structured-data

    Paragraph       - content separated by two newlines
      - Image       -
      - List        - a series of bullet-points

      Sentence      - contains links, formatting, dates
```
For the most-part, these classes do the looping-around for you, so that `Document.links()` will go through every section, paragraph, and sentence, to get their links.

Broadly speaking, you can ask for the data you'd like:
* **.sections()** &nbsp; &nbsp; &nbsp; - &nbsp; *==these things==*
* **.sentences()**
* **.paragraphs()**
* **.links()**
* **.tables()**
* **.lists()**
* **.images()**
* **.templates()** &nbsp; &nbsp; - &nbsp;*{{these|things}}*
* **.categories()**
* **.citations()** &nbsp; &nbsp; - &nbsp; *&lt;ref&gt;these guys&lt;/ref&gt;*
* **.infoboxes()**
* **.coordinates()**

or output things in various formats:
#### outputs:
* **.json()**  &nbsp; - &nbsp; &nbsp; *handy, workable data*
* **.text()**  &nbsp; - &nbsp; &nbsp; *reader-focused plaintext*
* **.html()**
* **.markdown()**
* **.latex()**  &nbsp; - &nbsp; &nbsp; *(ftw)*

##### fancy-times:
* **.isRedirect()**  &nbsp; &nbsp; - &nbsp; *boolean*
* **.isDisambiguation()**  &nbsp; &nbsp; - &nbsp; *boolean*
* **.title()**  &nbsp; &nbsp; &nbsp; - &nbsp;  &nbsp; &nbsp;*guess the title of this page*
* **.redirectsTo()**  &nbsp; &nbsp; - &nbsp; *{page:'China', anchor:'#History'}*

## Examples

### **wtf(wikiText)**
flip your wikimedia markup into a `Document` object

```javascript
import wtf from 'wtf_wikipedia'
wtf("==In Popular Culture==\n*harry potter's wand\n* the simpsons fence");
// Document {plaintext(), html(), latex()...}
```

### **wtf.fetch(title, [lang_or_wikiid], [options], [callback])**
retrieves raw contents of a mediawiki article from the wikipedia action API.

This method supports the **errback** callback form, or returns a [Promise](https://spring.io/understanding/javascript-promises) if one is missing.

to call non-english wikipedia apis, add [it's language-name](http://en.wikipedia.org/w/api.php?action=sitematrix&format=json) as the second parameter

```javascript
wtf.fetch('Toronto', 'de', function(err, doc) {
  doc.text();
  //Toronto ist mit 2,6 Millionen Einwohnern..
});
```
you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
wtf.fetch(64646, 'de').then(console.log).catch(console.log)
```
the fetch method follows redirects.

### **doc.text()**
returns only nice plain-text of the article
```js
var wiki =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>";
var text = wtf(wiki).text();
//"Boston's baseball field has a 37ft wall."
```
<!--
## **.custom({})**

if you're trying to parse a weird template, or an obscure wiki syntax somewhere, this library supports a customization
step, where you can pass-in random parsers to run, before your result is generated.

```js
var str = `{{myTempl|cool data!}} Whistling is a sport in some countries...`;
wtf.custom({
  mine: str => {
    let m = str.match(/^\{\{myTempl\|(.+?)\}\}$/);
    if (m) {
      return m[1];
    }
  }
});
wtf.parse(str);
//{title:'Whistling', custom: {mine:['cool data!']} }
```

this way, you can extend the library with your own regexes, and all that. -->

#### Section traversal:
```js
wtf(page).sections(1).children()
wtf(page).sections('see also').remove()
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
img.url()     // the full-size wikimedia-hosted url
img.thumnail() // 300px, by default
img.format()  // jpg, png, ..
img.exists()  // HEAD req to see if the file is alive
```

## **CLI**
if you're scripting this from the shell, or from another language, install with a `-g`, and then run:

```shell
$ wtf_wikipedia George Clooney --plaintext
# George Timothy Clooney (born May 6, 1961) is an American actor ...

$ wtf_wikipedia Toronto Blue Jays --json
# {text:[...], infobox:{}, categories:[...], images:[] }
```

### Good practice:
The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things, if you're going to hit it heavily -
* 1️⃣ pass a `Api-User-Agent` as something so they can use to easily throttle bad scripts
* 2️⃣ bundle multiple pages into one request as an array
* 3️⃣ run it serially, or at least, [slowly](https://www.npmjs.com/package/slow).
```js
wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
  'Api-User-Agent': 'spencermountain@gmail.com'
}).then((docList) => {
  let allLinks = docList.map(doc => doc.links());
  console.log(allLinks);
});
```

# Contributing
[Join in!](./contributing.md) - projects like these are only done with many-hands, and we try to be friendly and easy. PRs always welcome.

**Some Big Wins:**
1) Supporting [more templates](https://github.com/spencermountain/wtf_wikipedia/tree/master/src/templates) - ***This is actually kinda fun***.
2) Adding [more tests](https://github.com/spencermountain/wtf_wikipedia/tree/master/tests) - you won't believe how helpful this is.
3) Make a cool thing. [Holler](https://twitter.com/spencermountain) it at spencer.

if it's a big change, [make an issue](https://github.com/spencermountain/wtf_wikipedia/issues/new) and talk-it-over first.

Otherwise, go nuts!

# See also:
* [wtf-mlb](https://github.com/spencermountain/wtf-mlb) - generate game-result data from wikipedia pages
* [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView)
* [txtwiki](https://github.com/joaomsa/txtwiki.js)
* [Parsoid](https://www.mediawiki.org/wiki/Parsoid)

Thank you to the [cross-fetch](https://github.com/lquixada/cross-fetch) library.

MIT
<div align="center">
  <a href="https://nolanlawson.com/2017/03/05/what-it-feels-like-to-be-an-open-source-maintainer/">whew.</a>
</div>
