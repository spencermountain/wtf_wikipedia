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
  - [Extended Wiki ID i](#extended-wiki-id-i)
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
  - [Where to add the Citation Management - Output Format](#where-to-add-the-citation-management---output-format)
  - [LaTeX Citation Handling](#latex-citation-handling)
  - [Citation JSON Post-Processing (ToDo)](#citation-json-post-processing-todo)
    - [Alteration of the current JSON format](#alteration-of-the-current-json-format)
  - [HTML Citations - Replacement of Reflist-Marker](#html-citations---replacement-of-reflist-marker)
  - [LaTeX Citations - BibTex or Bibliography](#latex-citations---bibtex-or-bibliography)
    - [Convert Citations in BibTex-Database or Bibliography](#convert-citations-in-bibtex-database-or-bibliography)
  - [Citation and References](#citation-and-references)
- [Mathematical Expressions](#mathematical-expressions)
  - [Inline Math and Display Math in Separate Lines](#inline-math-and-display-math-in-separate-lines)
  - [Regular Expressions to determine Inline and Display Math (ToDo)](#regular-expressions-to-determine-inline-and-display-math-todo)
  - [Handling Mathematical Expressions in Export Formats](#handling-mathematical-expressions-in-export-formats)
    - [HTML and MathJax](#html-and-mathjax)
  - [MarkDown and Katex](#markdown-and-katex)
- [What it does](#what-it-does)
  - [But what about...](#but-what-about)
    - [Parsoid:](#parsoid)
    - [XML datadumps:](#xml-datadumps)
- [Methods](#methods)
  - [**.parse(pWikiSource)**](#parsepwikisource)
  - [**.from_api(title, lang_or_wikiid, callback)**](#from_apititle-lang_or_wikiid-callback)
  - [**.plaintext(pWikiSource)**](#plaintextpwikisource)
  - [**.custom({})**](#custom)
  - [**CLI**](#cli)
    - [LaTeX](#latex)
    - [Global scripting, downloading and cross-compilation](#global-scripting-downloading-and-cross-compilation)
- [Sample Output](#sample-output)
- [To Do](#to-do)
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
wtf.from_api('Toronto', 'en', function(pWikiSource) {
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

The structure of the JSON is a little verbose - but with a couple loops you should find everything you want.

# Download of Wiki Markdown
If you just want the source text of an MediaWiki article, call the API in the browser. The following example just download an article about Toronto from the english Wikiversity.
```javascript
var wtf = require('wtf_wikipedia');

//call the API and process the  markup 'pWikiSource' in the callback function of the API
wtf.from_api('Toronto', 'en', function(pWikiSource) {
  // do something with wiki markup return by the callback function in the parameter pWikiSource (String)
});
```
**Remark:** To distinguish local variables from parameters of functions a preceeding `p` can used to indicate that (e.g. `pWikiSource`). This denomination of parameters variables is just a support for reading the code without any impact on the Javascript interpretation of code.

## WikiID: Language and Domainname
You can retrieve the Wiki markdown from different MediaWiki products of the WikiFoundation. The domain name includes the Wiki product (e.g. Wikipedia or Wikiversity) and a language. The WikiID encoded the language and the domain determines the API that is called for fetching the source Wiki. The following WikiIDs are referring to the following domain name.   
* `en`: https://en.wikipedia.org   
* `enwiki`: https://en.wikipedia.org
* `enwikipedia`: https://en.wikipedia.org
* `enwikibooks`: https://en.wikibooks.org',
* `enwikinews`: https://en.wikinews.org',
* `enwikiquote`: https://en.wikiquote.org',
* `enwikisource`: https://en.wikisource.org',
* `enwikiversity`: https://en.wikiversity.org',
* `enwikivoyage`: https://en.wikivoyage.org'

If you use just the language identifier `en` then `wtf_wikipedia` assumes that the wiki is `Wikipedia`. The same is applied if you just use `enwiki`. Due to the fact that the Wiki Foundation has severval MediaWikis with a different content scope, also `enwiki` is mapped to the english Wikipedia.


```javascript
var wtf = require('wtf_wikipedia');

// Fetch the article about '3D Modelling' in english Wikiversity from the domain https://en.wikiversity.org
// call the API and process the  markup 'pWikiSource' in the callback function of the API
wtf.from_api('3D Modelling', 'enwikiversity', function(pWikiSource) {
  // do something with wiki markup return by the callback function in the parameter pWikiSource (String)
});
```
If you want to fetch Wiki markdown with a different language (e.g. german Wikiversity) use the appropriate language ID (e.g. `de` for german).
* `de`: https://de.wikipedia.org
* `dewiki`: https://de.wikipedia.org
* `dewikipedia`: https://de.wikipedia.org
* `dewikibooks`: https://de.wikibooks.org',
* `dewikinews`: https://de.wikinews.org',
* `dewikiquote`: https://de.wikiquote.org',
* `dewikisource`: https://de.wikisource.org',
* `dewikiversity`: https://de.wikiversity.org',
* `dewikivoyage`: https://de.wikivoyage.org'

## Extended Wiki ID i
In previous versions of `wtf_wikipedia` the wiki identifier (`wikiid`) used for `Wikipedia` the product specification `wiki`. To be consistent with wiki product specification part in the domain name `wikipedia` the following wiki IDs are added to list of Wiki ID mapping (defined in the folder `src/data/site_map.js`).

* `enwikipedia`: https://en.wikipedia.org
* `dewikipedia`: https://de.wikipedia.org

The additional entries for a consistent WikiID mapping are added with a [regular expression](https://gist.github.com/niebert/8bc998abde0f8d733e98794a6938c714) (Perl-like)

# Cross Compilation of Wiki Source
The library offers cross compilation into other formats.

## Plain Text Export

`wtf_wikipedia` also offers a plaintext method, that returns only paragraphs of nice text, and no junk:

```javascript
wtf.from_api('Toronto Blue Jays', 'en', function(pWikiSource) {
  var text = wtf.plaintext(pWikiSource);
  // "The Toronto Blue Jays are a Canadian professional baseball team..."
});
```
## Markdown Export

`wtf_wikipedia` also offers a markdown method, that returns converted into MarkDown syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D Modelling', 'enwikiversity', function(pWikiSource) {
  var text = wtf.markdown(pWikiSource);
  // converts the Wikiversity article about "3D Modelling"
  // from the english domain https://en.wikiversity.org
  // https://en.wikiversity.org/wiki/3D_Modelling
});
```
## HTML Export

`wtf_wikipedia` also offers a HTML method, that returns converted article into HTML syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D Modelling', 'enwikiversity', function(pWikiSource) {
  var text = wtf.html(pWikiSource);
  // converts the Wikiversity article about "3D Modelling"
  // from the english domain https://en.wikiversity.org
  // https://en.wikiversity.org/wiki/3D_Modelling
});
```
## LaTeX Export

`wtf_wikipedia` also offers a LaTeX method, that returns converted article into LaTeX syntax. The following code downloads the [article about 3D Modelling](https://en.wikiversity.org/wiki/3D_Modelling) from the english Wikiversity:

```javascript
wtf.from_api('3D_Modelling', 'enwikiversity', function(pWikiSource) {
  var text = wtf.latex(pWikiSource);
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
* Use the template mechanismn of the MediaWiki to render a output in a specific format. `wtf_wikipedia` is able to resolve a template.
* (Alternative) https://citation.js.org/demo/ how to convert citations with a specific style into an output format.
* (Alternative) [HandleBarsJS](https://handlebarsjs.com/) as a template engine might be helpful to convert JSON data about a citation into a specific output format.

## Where to add the Citation Management - Output Format
The way how citations are handled is depending on the Output Format and the preferences of the user of `wtf_wikipedia`
* export all citations in a BibTeX-format (use [FileSaver.js](https://www.npmjs.com/package/filesaver.js) by Eli Grey to generate a file save as Download for exporting generated BibTex-files in a browser).
* generate a bibliography and inject this bibliography into the output text at the marker `{{Reflist|2}}`.
```latex
\bibliography{mybib}{}
\bibliographystyle{apalike}
```
The replacement inserts all cited literature in the bibliography.
* create a citation helper function that is performed whenever a citation is found. It determines, what to inject at the location where the location is found in the Wiki markdown text.

**Conclusion:** A solution for the citation management could be a `citation.js` for all output formats in `/src/output` (e.g. `/src/output/latex/citation.js`). This library processes
* **(RefList)** the reference list at the marker `{{Reflist|2}}` or at the end of the document (see https://www.mediawiki.org/wiki/Template:Reflist ) and
* **(Ref-Tag)** replaces all citations with an appropriate marker that handles the citation in the corresponding output format - e.g. `(OER, 2013)` (see also https://www.mediawiki.org/wiki/Extension:Cite ).
```html
<ref>{{cite web|title=What is OER?|url=http://wiki.creativecommons.org/What_is_OER|work=wiki.creativecommons.org|publisher=Creative Commons|accessdate=18 April 2013}}</ref>
```

## LaTeX Citation Handling
Replace the citation in Wiki Markdown with a cite-command in LaTeX that uses the `id` of the citation record.
```javascript
citations : [
  {
      "id": "C1D20180327T1503",
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
   ....
]
```
The citation mechanism of BibTex will work if the citations in the JSON array is part of the BibTeX database of your LaTeX enviroment. So alteration and/or export of the collected citations in `wtf_wikipedia` is necessary.
```latex
\cite{C1D20180327T1503}
```
The cite command will be replaced by LaTeX according to your selected citation style (e.g. APA with `(Bonabeau, 1999)`).

## Citation JSON Post-Processing (ToDo)
The citations in the parse JSON by `wtf_wikipedia.js` needs some post-processing.

### Alteration of the current JSON format
The current JSON format for the citation array is a result of the storage of citations in the Wiki markdown language
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
      "id": "C1D20180327T1503",
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
     "id": "C1D20180327T1503",
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

* Create an attribute `author` in all bibliographic records in the author array `citations`,
```javascript
  var c = data.citations;
  for (var i = 0; i < c.length; i++) {
    // add to author array to all bibitem records b=c[i]
    c[i]["author"] = [];
    var b = c[i];
    // add an unique ID for bibitem records b=c[i]
    if (!(b.hasOwnProperty("id"))) {
      // if bibitem has no id-key add the
      b[id] =
    }
    var count = 1;
    var family = "";
    var given = "";
    var delkeys = [];
    var key = "";
    for (var k in c[i]) {
      key = "first"+count;
      if (b.hasOwnProperty(key)) {
        // store given name
        given = b[key];
        // store the key for delete
        delkeys.push(key);
      } else {
        given = ""  
      };
      key = "last"+count;
      if (b.hasOwnProperty(key)) {
        // store family name
        family =  c[i]][key];
        // store the key for delete
        delkeys.push(key);
        // add author to author array with family and given name
        (b["author"]).push({"family":family,"given",given})
      };
      count++;
    };
    // clean up key/value pairs
    // remove first1, last1, ... as key/value pairs from bibitem records b=c[i]
    for (var i = 0; i < delkeys.length; i++) {
      // delete keys first1, last1, first2, last2, ... if they exist.
      delete c[i][delkeys[i]];
    };
  }
```
* HandleBarsJS can be used to generated the citation in a specific format. E.g. the content of the `data.citations[i]["title"]` will replace the key marker `{{title}}` in a HTML template. The wrapped HTML-tags will render the title in italics.

```html
... <i>{{title}}</i>, ({{year}}), {{journal}} ...
```

## HTML Citations - Replacement of Reflist-Marker
In the Wiki Markdown the reference are stored either at the very end of Wiki markdown text or at the reference marker `{{Reflist|2}}` as the two column reference list of all citations found in the Wiki markdown article. The compilation of the citations in the parsed JSON file of `wtf_wikipedia` will be converted e.g. with a [HandleBarsJS](https://handlebarsjs.com/) template into an appropriate output format. A citation reference `(Bertin2009)` will be inserted that links to a HTML page anchor in the reference list:


## LaTeX Citations - BibTex or Bibliography
LaTeX has its own citation management system BibTex. If you want to use the BibTex, convert the collected citation in the array `data.citations`.
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
### Convert Citations in BibTex-Database or Bibliography
The JSON hash `data` contains an array with all parsed citations from the Wiki Markdown article. Loop over `data.citations` and convert all bibitem records from the array of all collected citations into the BibTex format (e.g. with [HandleBarsJS](https://handlebarsjs.com/) ).
Without BibTex it is possible to render the citation in the array `data.citations` into an `bibitem` in the bibliography. This is the same procedure without a database and explicit list of collected citations similar to an direct approach mentioned for HTML. The bibliography can be added to the end of the LaTeX file to add the citation.
(see [Bibiography in LaTeX](https://www.sharelatex.com/learn/Bibliography_management_with_bibtex) )

## Citation and References
In the Wiki markdown syntax the citation is inserted in the Wiki text at a position where the citation is mentioned. Later in the HTML generated output in the MediaWiki the collected citations are listed at the very end of the document or (if applicable) at the marker position (e.g. `{{Reflist|2}}`) in the Wiki markdown source.

In LaTeX this marker can be replaced by the appropriate LaTeX command (see http://www.bibtex.org/Using/ )
```latex
\bibliography{mybib}{}
\bibliographystyle{plain}
```
# Mathematical Expressions
Mathematical expressions are used in many scientific and educational content (not only core mathematical disciplines like Calculus, Algebra, Geometry, Statistics,...). Mathematical expressions are used when specific content can be described in precise form of a finite combination of symbols that is well-formed according to rules that depend on the context in which the expression is used. A precise description of the methodology may include mathematical expression by which the results are determined.
Removing the mathematical expressions from the MediaWiki content may result in an incomprehensive text fragement. 

This section describes the basic principles of handling mathematical expressions. The export functions are defined as library `math.js` in the subdirectories of `/src/output/`.


<span style="color: red">Important Remark:</span> Currently the export functions are defined already but the export of the parsed syntax tree of the document will not call these functions,

## Inline Math and Display Math in Separate Lines
In the german Wikiversity article about [mathematical Norms and Topology](https://de.wikiversity.org/wiki/Normen,_Metriken,_Topologie) you will recognize 
* (`INLINE`) inline mathematical expressions in the text and 
* (`BLOCK`) separated mathematical expression in a single line.
These two different applications of mathematical expressions can be distinguished by a leading colon ":" in the first column of Wiki Markdown article. In the following example `f(x)` is representation of a [mathematical expression in LaTeX](https://www.mediawiki.org/wiki/Extension:Math/Help:Formula).
```html
This expression <math> f(x) </math> is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
:<math> f(x) </math>
This is the text below the BLOCK expression.
```
The following functions are defined as library `/src/output/latex/math.js` and both functions declare the export of the mathematical expression provided in the parameter `pMath` in [LaTeX syntax](https://en.wikibooks.org/wiki/LaTeX/Mathematics).
```javascript
// handle inline mathematical expression
const doMathInline = (pMath, options) => {
  // pMath is internal LaTeX code for the mathematical expression e.g. "f(x)"
  // pMath does not contain the wrapped <math>-tags from the MediaWiki source
 let out = '$' + pMath + '$';
  return out ;
};

// handle mathematical expression displayed in a separate line
const doMathBlock = (pMath, options) => {
  let out = '\[' + pMath + '\]';
  return out + ' ';
};
```
Every export format has a subdirectory in `/src/output/` and all subdirectories have a `math.js` library with mainly two functions 
* `doMathInline(pMath, options)` to handle inline mathematical expressions and
* `doMathBlock(pMath, options)` to handle mathematical expressions is separate lines as a block.


## Regular Expressions to determine Inline and Display Math (ToDo)
Regular expressions can be used to determine what display format of the mathematical expression is intended by the authors of the Wiki MarkDown article.
* (`BLOCK`) First determine the DisplayMath by a regular expression with a 
  * newline, colon and `math`-tag opening the block with the mathematical expression in LaTeX syntax,
  * the mathematical expression in LaTeX syntax itself and 
  * closing `math`-Tag
* (`INLINE`) after replacement of `BLOCK` expressions the remained mathematical expressions wrapped in `math`-tags can be treated as `INLINE` math.
The export functions are defined in `/src/output/` under the respective export formats e.g.
* `/src/output/latex` for LaTeX,
* `/src/output/html` for HTML,
* `/src/output/markdown` for MarkDown with (KaTeX for rendering the mathematical expressions)

## Handling Mathematical Expressions in Export Formats 

Inline with the export design with helper functions the processing of the mathematical expressions can be done with
* helper function (similar to sentences, ... (see folder `/src/output` in the `wtf_wikipedia` repository) (NOT IMPLEMENTED) or
* as work around do the preprocessing of the Wiki Markdown sources befor performing the export of the markdown source so that the mathematical expressions are not removed.
### LaTeX
The easiest export format is LaTeX due to the fact, that the mathematical expressions in the Wiki Markdown article is written in LaTeX syntax. Therefore a cross-compilation of the latex syntax is not necessary.
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
The following latex code shows the converted Wiki markdown text in latex syntax:
```latex
This expression $ f(x) $ is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
\[ f(x) \]
This is the text below the BLOCK expression.
```

### HTML and MathJax 
The easiest way to export MediaWiki markdown article into HTML with mathematical expression is [MathJax](https://www.mathjax.org/), due to the fact, that MathJax can render mathematical expressions in the Wiki Markdown article is written in LaTeX syntax. Therefore a cross-compilation of the latex syntax is not necessary.
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
To allow mathematical expression rendering with MathJax 
* insert the [MathJax library as script tag in the output HTML file](https://www.mathjax.org/#gettingstarted) (for online use remote CDN - for offline use and integrate MathJax download a [MathJax ZIP copy and unzip on your computer](https://github.com/mathjax/MathJax/archive/master.zip) )  
* replace the opening and closing tags for `INLINE` and `BLOCK` with the following symbols
  * (`INLINE`) inline mathematical expressions are wrapped with a blackslash followed by an opening respectively closing bracket.
  * (`BLOCK`) line separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
The following latex code shows the converted Wiki markdown text in HTML syntax including the HTML header.
```html
<!DOCTYPE html>
<html>
<head>
<title>MathJax TeX Test Page</title>
  <script type="text/javascript" async
  	src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML">
  </script>
</head>
<body>
This expression \( f(x) \) is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
\[ f(x) \]
This is the text below the BLOCK expression.
</body>
</html>
```

With a [local MathJax installation](http://docs.mathjax.org/en/latest/start.html#installing-your-own-copy-of-mathjax) on your harddrive or server replace the [MathJax CDN link](http://docs.mathjax.org/en/latest/start.html) by the [appropriate path](http://docs.mathjax.org/en/latest/start.html#installing-your-own-copy-of-mathjax) 
e.g. as a subfolder `mathjax` in which the HTML-file is stored the script tag source will be:

```html
  <script type="text/javascript" async
  	src="mathjax/latest.js?config=TeX-MML-AM_CHTML">
  </script>
```

## MarkDown and Katex
The easiest way to export MediaWiki article into MarkDown with mathematical expressions is [KaTeX-Library](http://waylonflinn.github.io/markdown-it-katex/), due to the fact, that [KaTeX](https://khan.github.io/KaTeX/) can render mathematical expressions in LaTeX syntax in the Wiki Markdown. Therefore the mathematical expressions in the wiki article are just wrapped with a dollor symbol and [KaTeX](https://khan.github.io/KaTeX/) will render the syntax in markdown nicely for your output. Therefore a cross-compilation of the latex syntax is not necessary if you use .
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical block expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
To allow mathematical expression rendering with MathJax 
* insert the [MathJax library as script tag in the output HTML file](https://www.mathjax.org/#gettingstarted) (for online use remote CDN - for offline use and integrate MathJax download a [MathJax ZIP copy and unzip on your computer](https://github.com/mathjax/MathJax/archive/master.zip) )  
* replace the opening and closing tags for `INLINE` and `BLOCK` with the following symbols
  * (`INLINE`) inline mathematical expressions are wrapped with ONE Dollar symbol.
  * (`BLOCK`) line separated mathematical block expression are wrapped with TWO Dollar Symbols.
The following latex code shows the converted Wiki markdown text in HTML syntax including the HTML header.
```markdown
This expression $ f(x) $ is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
$$ f(x) $$
This is the text below the BLOCK expression.
```


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

# To Do
* Mathematical Expressions: The helper functions for the export formats are defined in `src/ouput/` in the resp. directory for the format ( e.g. `src/ouput/latex/math.js` for LaTeX export), but they were not called currently. TODO: Parsing must parse mathematical BLOCK and INLINE expressions and the export must call the respective the export helper functions defined e.g. in `/src/output/latex/math.js` for LaTeX output)

# Contributing

If you want to contribute with new output formats (e.g. defined in [PanDoc](https://www.pandoc.org/try) ) then 
* login with your GitHub account or [create an account](https://help.github.com/articles/signing-up-for-a-new-github-account/) for you 
* [fork](https://help.github.com/articles/fork-a-repo/) the current `wtf_wikipedia` repository and add e.g. a new export format in `/src/output/`,
* Build and test the generated library with `npm `
* create a Pull Request for the maintainer Spencer Kelly to integrate the new export format the original `wtf_wikipedia` respository.

Never-ender projects like these are only good with many-hands, and I try to be a friendly maintainer. (promise!)

```bash
npm install
npm test
npm run build #to package-up client-side
```
***DocToc*** is used to create a helpful table of contents in the README (see [DocToc-Installation]https://github.com/thlorenz/doctoc#installation) for further details on [NPM DocToc](https://www.npmjs.com/package/doctoc) ). Run `doctoc README.md` for updating the table of contents in the `README.md`.


MIT
