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
      many contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  <b>wtf_wikipedia</b> turns wikipedia's ad-hoc markup into <b>JSON</b>.
  <div>so getting data is easier.</div>
  <h2 align="center">Don't do this at home.</h2>
  <sup>really!</sup>
</div>
Wikipedia's custom markup is among the strangest and most illicit data formats you can find anywhere.
* en-wikipedia has 1.5m custom templates (as of 2018)
* don't ignore the [egyptian hieroglyphics syntax](https://en.wikipedia.org/wiki/Help:WikiHiero_syntax).
* or confuse [Birth_date_and_age](https://en.wikipedia.org/wiki/Template:Birth_date_and_age) with [Birth-date_and_age](https://en.wikipedia.org/wiki/Template:Birth-date_and_age).
* or the [partial-implementation of inline-css](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext),
* the nesting of syntax-similar templates,
* the unexplained [hashing scheme](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F) of image paths
* custom encoding of unicode, whitespace, and punctuation
* [right-to-left](https://www.youtube.com/watch?v=xpumLsaAWGw) values inside left-to-right templates.

**wtf_wikipedia** supports many recursive template shenanigans, depreciated and obscure template
variants, and illicit wiki-esque shorthands. It will try it's best, even when wikipedia editors make errors.

Making your own parser is never a good idea, but this library aims to be the most comprehensive and straight-forward way to get the data you want out of wikipedia.


# Install and Quick Start
```bash
npm install wtf_wikipedia
```

```javascript
var wtf = require('wtf_wikipedia');

wtf.fetch('Toronto', 'en', function(pWikiSource) {
  var data = wtf.parse(pWikiSource);
  console.log(data.infoboxes[0].data.leader_name);
  // "John Tory"
});
```

the result format:

```js
{
  "type": "",
  "infoboxes": [{
    "template": "",
    "data": {}
  }],
  "images": [],   // files + md5 urls
  "sections": [{  //(each heading)
      "title": "",
      "images": "",
      "lists": "",
      "sentences": [{ //(each sentence)
        "text": ""
        "links": [{
          "text": "",
          "page": ""
        }]
      }]
   }],
  "categories": [],
  "coordinates": [],
  "citations": [],
  "interwiki": {},
}
```

yeah, the structure is a little verbose - but with a couple loops you should find everything you want.

if you know what data you want, you can tell it to skip some needless parsing, by passing-in some options:
```js
wtf.parse(myWiki, {citations:false, infoboxes:false, images:false})
```

**wtf_wikipedia** also offers a plaintext method, that returns only paragraphs of nice text, and no junk:

```javascript
wtf.from_api('Toronto Blue Jays', 'en', function(markup) {
  var text = wtf.plaintext(markup);
  // "The Toronto Blue Jays are a Canadian professional baseball team..."
});
```
these work too!
```js
var html = wtf.html(wiki)
// The <a href="./Toronto_Blue_Jays">Toronto Blue Jays</a>....
var md = wtf.markdown(wiki)
// The **[Toronto Blue Jays](./Toronto_Blue_Jays)** ...
```

# Client-side

```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  wtf.from_api("On a Friday", "en", function(pWikiSource){// -> "Radiohead" redirect
    console.log(wtf.plaintext(pWikiSource))
    // "Radiohead are an English rock band from Abingdon..."
  })
</script>
```
The client-side application of `wtf_wikipedia.js` allows the browser to download and process of the Wiki markdown. The downloaded Wiki source can be processed with Javascript in the browser and new web-based content can be generated dynamically based on the Wiki-Source.

<font size="+2" align="center">
  <a href="https://spencermountain.github.io/wtf_wikipedia/">Demo!</a>
</font>

Furthermore format cross-compilation from wiki source into
* [plain text](https://github.com/spencermountain/wtf_wikipedia/blob/master/src/index.js),
* [Markdown](https://github.com/spencermountain/wtf_wikipedia/tree/master/src/output/markdown),
* [HTML](https://github.com/spencermountain/wtf_wikipedia/tree/master/src/output/html),
* [LaTeX](https://github.com/spencermountain/wtf_wikipedia/tree/master/src/output/latex)
* ...
is supported. The LaTeX output format is helpful to generate WikiBooks on the client side.


# What it does

* Detects and parses **redirects** and **disambiguation** pages
* Parse **infoboxes** into a formatted key-value object
* Handles recursive templates and links- like [[.. [[...]] ]]
* **Per-sentence** plaintext and link resolution
* Parse and format internal links
* creates
  [image thumbnail urls](https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F)
  from **File:XYZ.png** filenames
* Properly resolve {{CURRENTMONTH}} and {{CONVERT ..}} type templates
* Parse **images**, files, and **categories**
* converts 'DMS-formatted' (59°12\'7.7"N) geo-coordinates to lat/lng
* parses citation metadata
* Eliminate xml, latex, css, table-sorting, and 'Egyptian hierogliphics' cruft

its a combination of [instaview](https://en.wikipedia.org/wiki/User:Pilaf/InstaView),
[txtwiki](https://github.com/joaomsa/txtwiki.js), and uses the inter-language data from
[Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid).

## But what about...

### Parsoid:

Wikimedia's [Parsoid javascript parser](https://www.mediawiki.org/wiki/Parsoid) is the official wikiscript parser. It
reliably turns wikiscript into HTML, but not valid XML.

To use it for data-mining, you'll' need to:

```
parsoid(wikiscript) -> pretend DOM -> screen-scraping
```

but getting structured data this way (say, sentences or infobox data), is a complex + weird process still. This library
has 'borrowed' a lot of stuff from the parsoid project❤️

### XML datadumps:

This library is built to work well with [wikipedia-to-mongo](https://github.com/spencermountain/wikipedia-to-mongodb),
letting you parse a whole wikipedia dump on a laptop in a couple minutes.

# Methods

## **.parse(pWikiSource)**

turns wikipedia markup into a nice json object

```javascript
var wiki = "==In Popular Culture==\n*harry potter's wand\n* the simpsons fence";
wtf.parse(wiki);
// {type:'', sections:[...], infobox:{}, categories:[...], images:[] }
```

## **.from_api(title, lang_or_wikiid, callback)**

retrieves raw contents of a wikipedia article - or other mediawiki wiki identified by its
[dbname](http://en.wikipedia.org/w/api.php?action=sitematrix&format=json)

to call non-english wikipedia apis, add it as the second paramater to from_api

```javascript
wtf.from_api('Toronto', 'de', function(pWikiSource) {
  var text = wtf.plaintext(pWikiSource);
  //Toronto ist mit 2,6 Millionen Einwohnern..
});
```

you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
wtf.from_api(64646, 'de', function(pWikiSource) {
  //...
});
```

the from_api method follows redirects.

## **.plaintext(pWikiSource)**

returns only nice text of the article

```js
var wiki =
  "[[Greater_Boston|Boston]]'s [[Fenway_Park|baseball field]] has a {{convert|37|ft}} wall.<ref>{{cite web|blah}}</ref>";
var text = wtf.plaintext(wiki);
//"Boston's baseball field has a 37ft wall."
```

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

this way, you can extend the library with your own regexes, and all that.

## **CLI**
In the folder `/bin` you find some js-files that you can run from the shell.
### LaTeX
```shell
node ./bin/latex.js Swarm_intelligence
```
This script shows some processing steps in the console.log and shows the cross-compiled LaTeX code in the console as well.

### Global scripting, downloading and cross-compilation
if you're scripting this from the shell, or another language, install with a `-g`, and then:

```shell
$ wikipedia_plaintext George Clooney
# George Timothy Clooney (born May 6, 1961) is an American actor ...

$ wikipedia Toronto Blue Jays
# {text:[...], infobox:{}, categories:[...], images:[] }
```

# Sample Output

Sample output for [Royal Cinema](https://en.wikipedia.org/wiki/Royal_Cinema)

```javascript
{ type: 'page',
  sections:[ { title: '', depth: 0, sentences: [Array] },
     { title: 'See also', depth: 1, sentences: [Array] },
     { title: 'References', depth: 1, sentences: []
   }],
  infoboxes: [ {
    template: 'venue',
    data:
     { name: { text: 'Royal Cinema' },
       'former names': { text: 'The Pylon The Golden Princess' },
       image: { text: 'The Royal Cinema.jpg' },
       image_size: { text: '200px' },
       caption: { text: 'The Royal Cinema in 2017.' },
       address: { text: '608 College Street', links: [Array] },
       location: { text: 'Toronto, Ontario', links: [Array] },
       opened: { text: 1939 },
       architect: { text: 'Benjamin Swartz' },
       website: { text: 'theroyal.to' },
       capacity: { text: 390 } }
    }],
  interwiki: {},
  categories:[ 'City of Toronto Heritage Properties',
     'Cinemas and movie theatres in Toronto',
     'Streamline Moderne architecture in Canada',
     'Theatres completed in 1939',
     '1939 establishments in Ontario'
   ],
  images:[{ url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/The_Royal_Cinema.jpg',
       file: 'File:The Royal Cinema.jpg',
       thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Royal_Cinema.jpg/300px-The_Royal_Cinema.jpg' }
     ]
   }
```

Sample Output for [Whistling](https://en.wikipedia.org/w/index.php?title=Whistling)

```javascript
{ type: 'page',
  sections:
   [ { title: '', depth: 0, images: [Array], sentences: [Array] },
     { title: 'Techniques',
       depth: 1,
       images: [Array],
       sentences: [Array] },
     { title: 'Competitions', depth: 1, sentences: [Array] },
     { title: 'As communication', depth: 1, sentences: [Array] },
     { title: 'In music',
       depth: 1,
       images: [Array],
       sentences: [Array] },
     { title: 'By spectators', depth: 1, sentences: [Array] },
     { title: 'Superstitions', depth: 1, sentences: [Array] },
     { title: 'Children\'s television cartoon shows',
       depth: 1,
       lists: [Array],
       sentences: [] },
     { title: 'See also', depth: 1, lists: [Array], sentences: [] },
     { title: 'References', depth: 1, sentences: [] },
     { title: 'External links',
       depth: 1,
       lists: [Array],
       sentences: [] } ],
  infoboxes: [],
  citations: [],
  interwiki: {},
  categories: [ 'Oral communication', 'Vocal music', 'Vocal skills' ],
  images: [Array]
}
```

### Good practice:
The wikipedia api is [pretty welcoming](https://www.mediawiki.org/wiki/API:Etiquette#Request_limit) though recommends three things -
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
Never-ender projects like these are only good with many-hands, and I try to be a friendly maintainer. (promise!)

If you want to contribute with new output formats (e.g. defined in [PanDoc](https://www.pandoc.org/try) ) then
* login with your GitHub account or [create an account](https://help.github.com/articles/signing-up-for-a-new-github-account/) for you
* [fork](https://help.github.com/articles/fork-a-repo/) the current `wtf_wikipedia` repository and add e.g. a new export format in `/src/output/`,
* Build and test the generated library with `npm run build`
* If you update the `README.md` with a new export format run `doctoc README.md` to update the table of contents.
* create a [Pull Request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for the maintainer Spencer Kelly to integrate the new export format the original `wtf_wikipedia` respository.


```bash
npm install
npm test
npm run build #to package-up client-side
```


MIT
