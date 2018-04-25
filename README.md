<div align="center">
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/grade/e84f69487c9348ba9cd8e31031a05a4f" />
  </a>
  <a href="https://npmjs.org/package/wtf_wikipedia">
    <img src="https://img.shields.io/npm/v/wtf_wikipedia.svg?style=flat-square" />
  </a>
  <a href="https://www.codacy.com/app/spencerkelly86/wtf_wikipedia">
    <img src="https://api.codacy.com/project/badge/Coverage/e84f69487c9348ba9cd8e31031a05a4f" />
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
* [Birth_date_and_age](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) vs [Birth-date_and_age](https://en.wikipedia.org/wiki/Template:Birth-date_and_age).
* the partial-implementation of [inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),
* the deep nesting of [similar-syntax](https://twitter.com/spencermountain/status/934907924320792577) templates,
* the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) of image paths,
* the custom encoding of whitespace and some punctuation,
* [right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values in left-to-right templates.

**wtf_wikipedia** supports many ***recursive shenanigans***, depreciated and obscure template
variants, and illicit 'wiki-esque' shorthands.

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

## well ok then,
<kbd>npm install wtf_wikipedia</kbd>

```javascript
var wtf = require('wtf_wikipedia');

wtf.fetch('Whistling').then(doc => {

  doc.categories();
  //['Oral communication', 'Vocal music', 'Vocal skills']

  doc.sections('As communication').plaintext();
  // 'A traditional whistled language named Silbo Gomero..'

  doc.images(0).thumb();
  // 'https://upload.wikimedia.org..../300px-Duveneck_Whistling_Boy.jpg'

  doc.sections('See Also').links().map(l => l.page)
  //['Slide whistle', 'Hand flute', 'Bird vocalization'...]
});
```
***on the client-side:***
```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  //(follows redirect)
  wtf.fetch('On a Friday', 'en', function(err, doc) {
    var data = doc.infobox(0).data
    data['current_members'].links().map(l => l.page);
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
* **wtf(wikiText, [options])**
* **wtf.fetch(title, [lang_or_wikiid], [options], [callback])**

### outputs:
* **doc.plaintext()**
* **doc.html()**
* **doc.markdown()**
* **doc.latex()**

### Document methods:
* **doc.isRedirect()** - *boolean*
* **doc.isDisambiguation()** - *boolean*
* **doc.categories()**
* **doc.sections()**
* **doc.sentences()**
* **doc.images()**
* **doc.links()**
* **doc.tables()**
* **doc.citations()**
* **doc.infoboxes()**
* **doc.coordinates()**

### Section methods:
(a section is any content between **==these kind==** of headers)
* **sec.indentation()**
* **sec.sentences()**
* **sec.links()**
* **sec.tables()**
* **sec.templates()**
* **sec.lists()**
* **sec.interwiki()**
* **sec.images()**
* **sec.index()**
* **sec.nextSibling()**
* **sec.lastSibling()**
* **sec.children()**
* **sec.parent()**
* **sec.remove()**

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
  doc.plaintext();
  //Toronto ist mit 2,6 Millionen Einwohnern..
});
```
you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
wtf.fetch(64646, 'de').then(console.log).catch(console.log)
```
the fetch method follows redirects.

### **doc.plaintext()**
returns only nice text of the article
```js
var wiki =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>";
var text = wtf(wiki).plaintext();
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
projects like these are only done with many-hands, and I try to be a friendly and easy maintainer. (promise!)

[Join in!](./contributing.md)

Thank you to the [cross-fetch](https://github.com/lquixada/cross-fetch) and [jshashes](https://github.com/h2non/jshashes) libraries.

See also:
* [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView)
* [txtwiki](https://github.com/joaomsa/txtwiki.js)
* [Parsoid](https://www.mediawiki.org/wiki/Parsoid)

MIT
