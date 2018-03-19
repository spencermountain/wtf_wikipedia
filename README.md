family
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
    <a href="https://github.com/spencermountain">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      many contributors
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  <b>wtf_wikipedia</b> turns wikipedia's weird markup into <b>JSON</b>
  <div>so getting data is easier.</div>

  <h2 align="center">Don't be mad at me, be mad at them.</h2>

  <div align="center">Parsing wikiscript is basically NP-Hard.</div>

<sub>its <a href="https://en.wikipedia.org/wiki/Help:WikiHiero_syntax">really the worst</a>. I'm really trying my
best.</sub>

</div>

**wtf_wikipedia** supports vile recursive template shinanigans,
[half-XML implimentations](https://en.wikipedia.org/wiki/Help:HTML_in_wikitext), depreciated and obscure template
variants, and illicit wiki-esque shorthands.

Making your own parser is never a good idea, `what could go rong?!`, but this library is a very detailed and deliberate
creature. :four_leaf_clover:

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Install and Quick Start](#install-and-quick-start)
- [Download of Wiki Markdown](#download-of-wiki-markdown)
  - [WikiID: Language and Domainname](#wikiid-language-and-domainname)
- [Cross Compilation of Wiki Source](#cross-compilation-of-wiki-source)
  - [Plain Text Export](#plain-text-export)
  - [Markdown Export](#markdown-export)
  - [HTML Export](#html-export)
  - [LaTeX Export](#latex-export)
  - [Preprocessing of Wiki Markdown](#preprocessing-of-wiki-markdown)
  - [Define new Export formats](#define-new-export-formats)
    - [Create directory for new output format](#create-directory-for-new-output-format)
    - [Add the new output format as method](#add-the-new-output-format-as-method)
- [Client-side Wiki Markdown Processing](#client-side-wiki-markdown-processing)
- [Citation Management](#citation-management)
  - [Helpful Links for Citation Handling in JavaScript](#helpful-links-for-citation-handling-in-javascript)
  - [ToDo Citation Management](#todo-citation-management)
  - [HTML Citations](#html-citations)
  - [LaTeX Citations - BibTex or Bibliography](#latex-citations---bibtex-or-bibliography)
- [What it does](#what-it-does)
  - [But what about...](#but-what-about)
    - [Parsoid:](#parsoid)
    - [XML datadumps:](#xml-datadumps)
- [Methods](#methods)
  - [**.parse(wikimarkup)**](#parsewikimarkup)
  - [**.from_api(title, lang_or_wikiid, callback)**](#from_apititle-lang_or_wikiid-callback)
  - [**.plaintext(wikimarkup)**](#plaintextwikimarkup)
  - [**.custom({})**](#custom)
  - [**CLI**](#cli)
    - [LaTeX](#latex)
    - [Global scripting, downloading and cross-compilation](#global-scripting-downloading-and-cross-compilation)
- [Sample Output](#sample-output)
  - [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Install and Quick Start
If you want to check out the `wtf_wikipedia` source code just clone the package with `git`.
```bash
git clone https://github.com/spencermountain/wtf_wikipedia.git
cd wtf_wikipedia
npm install wtf_wikipedia
```
If you want to use the `wtf_wikipedia` in your NodeJS project.
```bash
npm install wtf_wikipedia --save
```
The `--save` option adds the library to the list of required packages of your project. Then you can create a NodeJS script `wikitest.js` with the following content:

```javascript
var wtf = require('wtf_wikipedia');

//call the API and parse the markup into JSON 'data'
wtf.from_api('Toronto', 'en', function(wikimarkup) {
  var data = wtf.parse(wikimarkup);
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

The structure of the JSON is a little verbose - but with a couple loops you should find everything you want.

# Download of Wiki Markdown
If you just want the source text of an MediaWiki article, call the API in the browser. The following example just download an article about Toronto from the english Wikiversity.
```javascript
var wtf = require('wtf_wikipedia');

//call the API and process the  markup 'pMarkup' in the callback function of the API
wtf.from_api('Toronto', 'en', function(pMarkup) {
  // do something with wiki markup return by the callback function in the parameter pMarkup (String)
});
```
## WikiID: Language and Domainname
You can retrieve the Wiki markdown from different MediaWiki products of the WikiFoundation. The domain name includes the Wiki product (e.g. Wikipedia or Wikiversity) and a language. The WikiID encoded the language and the domain determines the API that is called for fetching the source Wiki. The following WikiIDs are referring to the following domain name.   
* `enwiki`: https://en.wikipedia.org
* `enwikibooks`: https://en.wikibooks.org',
* `enwikinews`: https://en.wikinews.org',
* `enwikiquote`: https://en.wikiquote.org',
* `enwikisource`: https://en.wikisource.org',
* `enwikiversity`: https://en.wikiversity.org',
* `enwikivoyage`: https://en.wikivoyage.org'

```javascript
var wtf = require('wtf_wikipedia');

// Fetch the article about '3D Modelling' in english Wikiversity from the domain https://en.wikiversity.org
// call the API and process the  markup 'pMarkup' in the callback function of the API
wtf.from_api('3D Modelling', 'enwikiversity', function(pMarkup) {
  // do something with wiki markup return by the callback function in the parameter pMarkup (String)
});
```
If you want to fetch Wiki markdown with a different language (e.g. german Wikiversity) use the appropriate language ID (e.g. `de` for german).
* `dewiki`: https://de.wikipedia.org
* `dewikibooks`: https://de.wikibooks.org',
* `dewikinews`: https://de.wikinews.org',
* `dewikiquote`: https://de.wikiquote.org',
* `dewikisource`: https://de.wikisource.org',
* `dewikiversity`: https://de.wikiversity.org',
* `dewikivoyage`: https://de.wikivoyage.org'

# Cross Compilation of Wiki Source
The library offers cross compilation into other formats.

## Plain Text Export

`wtf_wikipedia` also offers a plaintext method, that returns only paragraphs of nice text, and no junk:

```javascript
wtf.from_api('Toronto Blue Jays', 'en', function(wikimarkup) {
  var text = wtf.plaintext(wikimarkup);
  // "The Toronto Blue Jays are a Canadian professional baseball team..."
});
```
## Markdown Export

`wtf_wikipedia` also offers a markdown method, that returns converted into MarkDown syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D Modelling', 'enwikiversity', function(wikimarkup) {
  var text = wtf.markdown(wikimarkup);
  // converts the Wikiversity article about "3D Modelling"
  // from the english domain https://en.wikiversity.org
  // https://en.wikiversity.org/wiki/3D_Modelling
});
```
## HTML Export

`wtf_wikipedia` also offers a HTML method, that returns converted article into HTML syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D Modelling', 'enwikiversity', function(wikimarkup) {
  var text = wtf.html(wikimarkup);
  // converts the Wikiversity article about "3D Modelling"
  // from the english domain https://en.wikiversity.org
  // https://en.wikiversity.org/wiki/3D_Modelling
});
```
## LaTeX Export

`wtf_wikipedia` also offers a LaTeX method, that returns converted article into LaTeX syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D_Modelling', 'enwikiversity', function(wikimarkup) {
  var text = wtf.latex(wikimarkup);
  // converts the Wikiversity article about "3D Modelling"
  // from the english domain https://en.wikiversity.org
  // https://en.wikiversity.org/wiki/3D_Modelling
});
```
## Preprocessing of Wiki Markdown
`wtf.from_api()`-Call fetches the Wiki Markdown from the MediaWiki. After downloading some preprocessing might be helpful for further improvement of the cross-compilation of the source text from the MediaWiki. The following example shows how `wtf.wikiconvert` can be used to perform some basic operations.
```javascript
wtf.from_api(title, 'en', function (wikimarkdown, page_identifier, lang_or_wikiid) {
  var options = {
    page_identifier:page_identifier,
    lang_or_wikiid:lang_or_wikiid
  };
  var vDocJSON = {}; // vDocJSON stores parsed content
  // init "wikiconvert" the Wiki Source - necessary for expanding relative URLs for images and local links
  wtf.wikiconvert.init('en','wikipedia',vDocJSON);
  // init the article name with the page_identifier, also necessary for handling relative links
  wtf.wikiconvert.initArticle(page_identifier);
  // replace local image urls (e.g. [[File:my_image.png]])
  // by a remote image url [[File:https://en.wikipedia.org/wiki/Special:Redirect/file/my_image.png]]
  wikimarkdown = wtf.wikiconvert.replaceImages(wikimarkdown);
  // replace local  urls (e.g. [[Other Article]])
  // by a remote url to the Wiki article e.g. [https://en.wikipedia.org/wiki/Other_Article Other Article]
  wikimarkdown = wtf.wikiconvert.replaceWikiLinks(wikimarkdown);
  // perform the post processing after wikimarkdown compilation
  wikimarkdown = wtf.wikiconvert.post_process(wikimarkdown);

  var latex = wtf.latex(wikimarkdown, options);
  // console.log(latex);
});
```

You can test these features with the js-file `./bin/latex.js` by calling:
```shell
$ node ./bin/latex.js George_Clooney
```

## Define new Export formats
This section explains how developers can extend the capabilities of `wtf_wikipedia` to additional export formats.

If you want to create new additional export formats, [try PanDoc document conversion](https://pandoc.org/try) to get an idea what formats can be useful and are used currently in PanDoc (see https://pandoc.org). Select as [input format  `MediaWiki` in the PanDoc Webinterface](https://pandoc.org/try) and copy a MediaWiki source text into the left input textarea. Select an output format and press convert.

The following sections describe the definition of a new export format in 4 steps:

* Create directory for new output format
* Add the new output format as method

### Create directory for new output format
First go to the subdirectory `/src/output`. We will show, how a new export format can be added to `wtf_wikipedia`.
Create a new subdirectory (e.g. `/src/output/latex`) to support a new export format. Copy the files
* `index.js`,
* `infobox.js`,
* `sentence.js`,
* `table.js`
from the subdirectory `/src/output/html` into the new subdirectory for the export format (e.g. `/src/output/latex`). Adapt these function step by step, so that the exported code generates the sentences and tables in an appropriate syntax of the new format.

At the very end of the file `/src/output/latex/index.js` the new export function is defined. Alter the method name
```javascript
const toHtml = function(str, options) {
  ....
}
```
to a method name of the new export format (e.g. for LaTeX the method name `toLatex`)  
```javascript
const toLatex = function(str, options) {
  ....
}
```
The code of this method can be reused in most cases (no alteration necessary).

### Add the new output format as method
The new output format can be exported by `wtf_wikipedia` if a method is added to the file `index.js`.
Add a new `require` command must be added to the other export formats that are already integrated in `wtf_wikipedia`.
```javascript
const markdown = require('./output/markdown');
const html     = require('./output/html');
const latex    = require('./output/latex');
```
After adding the last line for the new export format, the code for cross-compilation to LaTeX is available in the variable `latex`. The last step is to add the latex output format to the Module Export. Therefore the method for the new output format must be added to the export hash of `wtf_wikipedia` add the very end of `index.js` by adding the line `latex: latex,` to export hash.

```javascript
module.exports = {
  from_api: from_api,
  plaintext: plaintext,
  markdown: markdown,
  html: html,
  latex: latex,
  version: version,
  custom: customize,
  wikiconvert: wikiconvert,
  parse: (str, obj) => {
    obj = obj || {};
    obj = Object.assign(obj, options); //grab 'custom' persistent options
    return parse(str, obj);
  }
};
```

# Client-side Wiki Markdown Processing

```html
<script src="https://unpkg.com/wtf_wikipedia@latest/builds/wtf_wikipedia.min.js"></script>
<script>
  wtf.from_api("On a Friday", "en", function(wikimarkup){// -> "Radiohead" redirect
    console.log(wtf.plaintext(wikimarkup))
    // "Radiohead are an English rock band from Abingdon..."
  })
</script>
```
The client-side application of `wtf_wikipedia.js` allows the browser to download and process of the Wiki markdown. The downloaded Wiki source can be processed with Javascript in the browser and new web-based content can be generated dynamically based on the Wiki-Source.

<font size="+2" align="center">
  <a href="https://spencermountain.github.io/wtf_wikipedia/">Demo!</a>
</font>

Furthermore format cross-compilation from wiki source into
* plain text,
* Markdown,
* HTML,
* LaTeX
* ...
is supported. The LaTeX output format is helpful to generate WikiBooks on the client side.

# Citation Management
The citations in the Wiki markdown are parsed by `wtf_wikipedia`.
```javascript
wtf.from_api("Swarm intelligence", 'en', function (wikimarkdown, page_identifier, lang_or_wikiid) {
  var options = {
    page_identifier:page_identifier,
    lang_or_wikiid:lang_or_wikiid
  };
  var data = wtf.parse(wikimarkdown,options);
  console.log(JSON.stringify(data, null, 2));
});
```
The JSON hash `data` contains all parsed citation from the Wiki Markdown article in `data.citations`, which is an array of all collected citations during the `wtf.parse(...)`-Call.

## Helpful Links for Citation Handling in JavaScript
* https://citation.js.org/demo/ how to convert citations with a specific style into an output format.
* [HandleBarsJS](https://handlebarsjs.com/) as a template engine might be helpful to convert JSON data about a citation into a specific output format.

## ToDo Citation Management
The citations in the parse JSON by `wtf_wikipedia.js` needs some post-processing.
```javascript
citations : [
  {
     "cite": "book",
     "title": "Swarm Intelligence: From Natural to Artificial Systems",
     "first1": "Eric",
     "last1": "Bonabeau",
     "first2": "Marco",
     "last2": "Dorigo",
     "first3": "Guy",
     "last3": "Theraulaz",
     "year": 1999,
     "isbn": "0-19-513159-2"
   },
   {
       "cite": "journal",
       "last1": "Bertin",
       "first1": "E.",
       "last2": "Droz",
       "first2": "M.",
       "last3": "Grégoire",
       "first3": "G.",
       "year": 2009,
       "arxiv": 907.4688,
       "title": "Hydrodynamic equations for self-propelled particles: microscopic derivation and stability analysis",
       "journal": "[[J. Phys. A]]",
       "volume": 42,
       "issue": 44,
       "page": 445001,
       "doi": "10.1088/1751-8113/42/44/445001",
       "bibcode": "2009JPhA...42R5001B"
     }
]
```
must be converted into
The citations in the parse JSON by `wtf_wikipedia.js` needs some post-processing.
```javascript
citations : [
  {
      "id": "Q23571040",
      "type": "book",
      "title": "Swarm Intelligence: From Natural to Artificial Systems",
      "author":[
        {
          "given": "Eric",
          "family": "Bonabeau",
        },
        {
          "given": "Marco",
          "family": "Dorigo",
        },
        {
          "given": "Guy",
          "family": "Theraulaz",
        }
    ],
     "year": 1999,
     "isbn": "0-19-513159-2"
   },
   {
     "id": "Q23571041",
     "type": "journal",
     "author":[
       {
         "family": "Bertin",
         "given": "E.",
        },
       {
         "family": "Droz",
         "given": "M.",
       },
       {
         "family": "Grégoire",
         "given": "G.",
       }
     ],
       "year": 2009,
       "arxiv": 907.4688,
       "title": "Hydrodynamic equations for self-propelled particles: microscopic derivation and stability analysis",
       "journal": "[[J. Phys. A]]",
       "volume": 42,
       "issue": 44,
       "page": 445001,
       "doi": "10.1088/1751-8113/42/44/445001",
       "bibcode": "2009JPhA...42R5001B"
     }
]
```
After this conversion is done, the citations can be cross-compiled in the output format with a template or added to a BibTeX-file that is used for creating a LaTeX document.

## HTML Citations
In the Wiki Markdown the reference are stored either at the very end of Wiki markdown text or at the reference marker `{{Reflist|2}}` as the two column reference list of all citations found in the Wiki markdown article. The compilation of the citations in the parsed JSON file of `wtf_wikipedia` will be converted e.g. with a [HandleBarsJS](https://handlebarsjs.com/) template into an appropriate output format. A citation reference `(Bertin2009)` will be inserted that links to a HTML page anchor in the reference list:


## LaTeX Citations - BibTex or Bibliography
LaTeX has its own citation management system BiBTex of the same procedure can be applied as for HTML and a bibliography can be added to the end of the LaTeX file to add the citation.
(see [Bibiography in LaTeX](https://www.sharelatex.com/learn/Bibliography_management_with_bibtex) )

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

## **.parse(wikimarkup)**

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
wtf.from_api('Toronto', 'de', function(wikimarkup) {
  var text = wtf.plaintext(wikimarkup);
  //Toronto ist mit 2,6 Millionen Einwohnern..
});
```

you may also pass the wikipedia page id as parameter instead of the page title:

```javascript
wtf.from_api(64646, 'de', function(wikimarkup) {
  //...
});
```

the from_api method follows redirects.

## **.plaintext(wikimarkup)**

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

## Contributing

Never-ender projects like these are only good with many-hands, and I try to be a friendly maintainer. (promise!)

```bash
npm install
npm test
npm run build #to package-up client-side
```
***DocToc*** is used to create a helpful table of contents in the README (see [DocToc-Installation]https://github.com/thlorenz/doctoc#installation) for further details on [NPM DocToc](https://www.npmjs.com/package/doctoc) ). Run `doctoc README.md` for updating the table of contents in the `README.md`.


MIT
