
# Applications of wtf_wikipedia

## Wiki2Reveal - on the fly cross compilation into a Presentation
* **[Wikiversity Article with Mathematical Expression](https://de.wikiversity.org/wiki/Normen,_Metriken,_Topologie)**
* **[Export Format RevealJS Presentation](https://niebert.github.io/FA1Reveal/FA1/topologie1/Normen_Metriken_Topologie_reveal.html)** - currently static export with [PanDocElectron](https://en.wikiversity.org/wiki/PanDocElectron) - can be generated on the fly with `wtf_wikipedia` with RevealJS export format.
* [Wiki2Reveal](https://niebert.github.io/Wiki2Reveal) as online demo to create dynamically from Wiki source text a reveal presentation.

# Download of Wiki Markdown
If you just want the source text of an MediaWiki article, call the API in the browser. The following example just download an article about Toronto from the english Wikiversity.
```javascript
var wtf = require('wtf_wikipedia');

//call the API and process the  markup 'pWikiSource' in the callback function of the API
wtf.fetch('Toronto', 'en', function(pWikiSource) {
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

## Extended Wiki ID in site_map.js
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

### Workflow for new Exports
The following sections describe the definition of a new export format in 4-5 steps:

* (1) Create directory for new output format in `/src/output` e.g. `/src/output/odf` for Open Document Format for Office suites.
* (2) Clone e.g. the export libraries from LaTeX and adapt them to your new export format.
* (3) require the new export format in `/src/index.js` e.g. by
```javascript
const odf     = require('./output/odt');
```
   and extend the module exports at the very end of  the export libraries
```javascript
module.exports = {
  from_api: from_api,
   ...
  odf: odf,
  ...		
  parse: (str, obj) => {
    obj = obj || {};
    obj = Object.assign(obj, options); //grab 'custom' persistent options
    return parse(str, obj);
  }
};
```
* (4) Create or extend the test script in directory `/tests`. A test script for the format `odf` will be named `odf.test.js`. A test script for the HTML based presentation [RevealJS](https://revealjs.com/) format `reveal` will be named `reveal.test.js`. Look at other formats e.g. `html.test.js` to understand the concept of testing mechanism. Basically you create the   
  * exported a defined text with `wtf` (e.g. `wtf.latex(...)`) and store it in the `have`-variable
  * define the desired output in the `want` variable,
  * and the `t.equal(have, want, "test-case-name")` defines the comparision of `have` and `want`.
  * `html_tidy()`, `latex_tidy()`, ... are removing comments and generate compressed equivalent code for a smarter `t.equal`-comparison. These functions are defined in `tests/tidy.js`.
* (5) run test and build for the extended
 `wtf_wikipedia`
* (6 optional) create a Pull request on the original `wtf_wikipedia` repository of GitHub by Spencer Kelly to share the code with the community

### Handling Relative Links and Inter-Wiki Links in Wiki Source
If a source text in Wikipedia or Wikiversity is exported, the file is in general removed out of the relative link context. The library `/src/lib/wikiconvert.js` contains a Javascript class to preprocessing the relative links.

General approach:
* Wiki source text was fetched e.g. from english Wikiversity then the
   * the language ID is `en` and
   * the domain ID is `wikiversity`
* a relative link replacement should be defined like this:
   * **Input Wiki Markdown:**
```markdown
My [[relative link]] and my german [[w:de:my_link|inter-wiki link] are exported.
```
   * **Output HTML:**
```html
My <a href="https://en.wikiversity.org/wiki/relative_link" target="_blank">relative link</a> and
my german <a href="https://de.wikiversity.org/wiki/relative_link" target="_blank">inter-wiki link</a> are exported.
```
* Inter-wiki links can be encoded by `domain:language:article` (e.g. `w:de:my_article` which is short for  `wikipedia:de:my_article`) to refer to content that is available in a specific language only (e.g. the english Wikipedia only).

Mapping wiki domain abbreviation with a hash:
```javscript
var vDomainMap = {};
vDomainMap["w"] = "wikipedia";
vDomainMap["wikipedia"] = "wikipedia";
vDomainMap["Wikipedia"] = "wikipedia";
vDomainMap["v"] = "wikiversity";
vDomainMap["wikiversity"] = "wikiversity";
vDomainMap["Wikiversity"] = "wikiversity";
vDomainMap["b"] = "wikibooks";
vDomainMap["wikibooks"] = "wikibooks";
vDomainMap["Wikibooks"] = "wikibooks";
```

The domain map is an associative array that maps a possible domain prefix in an interwiki to an explicit part of the domain name. The explicit part of the domain name (e.g. `wikipedia` for `w`) is necessary to expand relative link to absolute links. This link expanding procedure assures that the relative links still work, when the export file displayed out the MediaWiki server context (e.g. Wikipedia or Wikiversity).  

### Defining test cases for the new Format
Test cases are defined in the folder `tests/` and have the ending `.test.js` (e.g. `html.test.js` for the HTML test cases). Just by naming the file with that ending `.test.js` the test will be included in the NPM test call `npm run test`. Desired output can be generated for different format by the [PanDoc-Try web-interface](https://pandoc.org/try). Select as input format in [PanDoc-Try web-interface](https://pandoc.org/try) the format MediaWiki and select as output format the new format (e.g. `Reveal` for web-based presentation or `Open Document Format` to generate LibreOffice files based on a template file with all your style).

### Offline Use of Exported File
Media files like:
* images,
* audio,
* video
files can be displayed offline (without internet connectivity) if and only if the media files are stored locally on the device as well. The command line tool  `wget` can be used for downloading the media files to the device. The file can be stored into subfolders (e.g. of the generated HTML file) in corresponding subfolders. For example in a subfolder `export/my_html/`
* `export/my_html/images`,
* `export/my_html/audio`,
* `export/my_html/video`
The selection of the subdirectory can be done with the following function that checks the extension of the file and derives the subdirectory name from it:  

```javascript
function getExtensionOfFilename(pFilename) {
  var re = /(?:\.([^.]+))?$/;
  // re.exec("/path.file/project/output.dzslides.html")[1];  returns  "html"
  return re.exec(pFilename)[1];   // "html"
}


function getMediaSubDir(pMediaLink) {
  var vExt = getExtensionOfFilename(pMediaLink);
  var vSubDir ="images"
  switch (vExt) {
    case "wav":
        vSubDir = "audio"
    break;
    case "mp3":
        vSubDir = "audio"
    break;
    case "mid":
        vSubDir = "audio"
    break;
    case "ogg":
        vSubDir = "video"
    break;
    case "webm":
        vSubDir = "video"
    break;
    default:
        vSubDir = "images"
  };
  return vSubDir;
}
```
## Create Office Documents
If you try [PanDoc document conversion](https://pandoc.org/try) the key to generate Office documents is the export format ODF.
[LibreOffice](https://en.wikipedia.org/wiki/LibreOffice) can load and save even the [OpenDocument Format](http://opendocumentformat.org/) and LibreOffice can load and save MICR0S0FT Office formats. So exporting to Open Document Format will be good option to start with in `wtf_wikipedia`. The following description are a summary of aspects that support developers in bringing the Office export format e.g. to web-based environment like the [ODF-Editor](http://webodf.org/demos/).
OpenDocument Format provides a comprehensive way forward for `wtf_wikipedia` to exchange documents from a `MediaWiki` source text reliably and effortlessly to different formats, products and devices. Regarding the different Wikis of the [Wiki Foundation](https://en.wikipedia.org/wiki/Wikimedia_Foundation) as a [Content Sink](https://en.wikiversity.org/wiki/Educational_Content_Sink) e.g. the educational content in [Wikiversity](https://en.wikiversity.org) is no longer restricted to a single export format (like PDF) open ups access to other specific editors, products or vendors for all your needs. With `wtf_wikipedia` and an ODF export format the users have the opportunity to choose the 'best fit' application of the Wiki content. This section focuses on Office products.

### Open Document Format ODT
Some important information to support Office Documents in the future
* see [WebODF](http://webodf.org/) how to [edit ODF documents on the web or display slides](http://webodf.org/demos/). Current limitation of WebODF is, that does not render mathematical expressions, but alteration in [WebODF editor](http://webodf.org/demos/) does not remove the mathematical expressions from the ODF file (state 2018/04/07). WebODF does not render the mathematical expressions but this may be solved in the WebODF-Editor by using [MathJax](https://www.mathjax.org/) or [KaTeX](https://khan.github.io/KaTeX/) in the future.
* The `ODT`-Format is the default export format of LibreOffice/OpenOffice. Supporting the [Open Community Approach](https://en.wikiversity.org/wiki/Open_Community_Approach) OpenSource office products are used to avoid commercial dependencies for using generated Office products.
  * The `ODT`-Format of LibreOffice is basically a [ZIP-File](https://en.wikipedia.org/wiki/Zip_(file_format)).
  * Unzip shows the folder structure within the ZIP-format. Create a subdirectory e.g.  with the name `zipout/`  and call `unzip mytext.odt -d zipout` (Linux, MacOSX).
  * The main text content is stored in `content.xml` as the main file for defining the content of Office document
  * Remark: Zipping the folder content again will create a parsing error when you load the zipped office document again in `LibreOffice`. This may be caused by an inappropriate order in the generated ZIP-file. The file `mimetype` [must be the first file in the ZIP-archive](https://crcok.wordpress.com/2014/10/25/unzip-and-zip-openoffice-org-odt-files/).
  * The best way to generate ODT-files is to generate an ODT-template `mytemplate.odt` with LibreOffice and all the styles you want to apply for the document and place a marker at specific content areas, where you want to replace the cross-compiled content with `wtf_wikipedia` in `content.xml`. The file  `content.xml` will be updated in ODT-ZIP-file. Also marker replacement is possible in ODF-files (see also [WebODF demos](http://webodf.org/demos/).
  * Image must be downloaded from the MediaWiki (e.g. with an NPM equivalent of `wget` for fetching the image, audio or video) and add the file to the folder structure in the ZIP. Create a ODT-file with LibreOffice with an image and unzip the ODT-file to learn about way how ODT stores the image in the ODT zip-file.
* [JSZip](https://stuk.github.io/jszip/): JSZip can be used to update and add certain files in a given ODT template (e.g. `mytemplate.odt`). Handling ZIP-files in a cross-compilation WebApp with `wtf_wikipedia` that runs in your browser and generates an editor environment for the cross-compiled Wiki source text (like the [WebODF editor](http://www.webodf.org/demo/ci/wodotexteditor-0.5.9/localeditor.html)). The updating the ODT template as ZIP-file can be handled with [JSZip](https://stuk.github.io/jszip/) by replacing the `content.xml` in a ZIP-archive. `content.xml` can be generated with `wtf_wikipedia` when the `odf`-export format is added to `/src/output/odf` (ToDo: Please create a pull request if you have done that).
* **LibreOffice Export:** Loading ODT-files in [LibreOffice](https://en.wikipedia.org/wiki/LibreOffice) allows to export the ODT-Format to
  * Office documents `doc`- and `docx`-format,  
  * Text files (`.txt`),
  * HTML files (`.html`),
  * Rich Text files (`.rtf`),
  * PDF files (`.pdf`) and even
  * PNG files (`.png`).
* Planing of the ODT support can be down in this README and collaborative implementation can be organized with Pull Requests PR.
* Helpful Libraries: [node-odt](https://www.npmjs.com/package/node-odt), [odt](https://www.npmjs.com/package/odt)

### Word Export with Javascript Libraries
* `wtf_wikipedia` supports HTML export,
* the library `html-docx-js` supports [cross-compilation of HTML into docx-format](https://www.npmjs.com/package/html-docx-js)

### Create directory for new output format
First go to the subdirectory `/src/output`. We will show, how a new export format can be added to `wtf_wikipedia`.
Create a new subdirectory (e.g. `/src/output/latex`) to support a new export format. Copy the files
* `index.js`,
* `infobox.js`,
* `sentence.js`,
* `table.js`,
* `math.js` (not supported in all formats of &lt;2.6.1 - see [ToDo](#todo))
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
