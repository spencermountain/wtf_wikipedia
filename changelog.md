## 1.0.0
* make `sections` into an ordered array, instead of an es6 Map thing. - add 'depth' too

## 2.0.0
* move possibly-repeatable data into the `sections` object, list 'lists' and 'tables'
* change library export name to `wtf`
* turn `infobox` into 'infoboxes' array
* moved 'infobox_template' to infobox.type
* change initial depth to 0
* change 'translations' property to 'interwiki'
* support {{main}} and {{wide image|}} templates
## 2.1.0
* support table '! row' row heading syntax, and other forms
## 2.2.0
* support for {{coords}} geo-coordinate parsing+conversion
* early-support for custom template-parsing
## 2.5.0
* co-ordinate parsing fix
* support longer ref tags
* smarter disambiguation for interwiki links vs pages containing ':'
* more support for various list syntaxes

## 2.6.0
* support for markdown output
* support for html output
* add page 'title' to response, where possible.
* better support for capturing the `[[link]]'s` syntax
* opt-out of citation, infobox, image ... parsing
* support a whack of date/time/age templates
## 2.6.1
* better html output tables/infoboxes

## 3.0.0
* BIG API RE-WRITE!
* move `.parse()` to main `wtf()` method
* allow repeated processes without a pre-parse of the document
* wtf.fetch() uses promises, and native `fetch()` method (when available)
* allow per-section images, lists, tables + templates
* section depth values now start at 0
* infobox values now return sentence objects
* latex output (thanks @niebert!)
* refactor shell scripts to `wtf_wikipedia Toronto --plaintext`
* use babel-preset-env cause it's new-new
* update deps
## 3.1.0
* improved .json() results
* guess a page's title based on bold formatting in first sentence
* make section.title a function

## 4.0.0
* 🚨 non-api changing, but large result-format change
* add `.wikitext()` method to Document, Section, Sentence (thanks @niebert)
* move infobox, citation parser/data to Section class
* `.templates()` are now an ordered array, instead of an object, and include infoboxes and citations
* add (early) support for 'generic' key-value template parsing
* normalize/lowercase template/infobox properties - add loose `.get('key')` method to Infobox class
* mess-around with citation-template formatting
* beginning to support unknown template forms
* move `date` data from Sentence to Section object.
* rollback of awkward+undocumented `options` param in parser (but keep options param for output methods)
* add support for about a hundred new templates
* templates, including citations, try to be flat-text, and no-longer return Sentence objects
## 4.1.0
* remove repeated/redundant text in `.links()` results
* don't automatically titlecase link srcs anymore
## 4.2.0
* return a result or undefined for `sentences.bolds(0)`, and the like
### 4.2.2
* support dollar templates
### 4.5.0
* support `section(0).wikitext()`
* support inline {{marriage}} template
* dangling semi-colons in first-sentence parentheses
### 4.6.0
* `<gallery>` tag support in `.images()`
* support pageids again in .fetch()
* better disambiguation-page detection in english
* remove wikitext from caption titles
* support 3-level templates (whew!)

## 5.0.0
* new `Table` class and `List` classes
* improved table-parser - generate name `col1` instead of `col-0`
* support `options.verbose_template` for debugging
* support recursive tables
### 5.1.0
* improved support for gallery tag
* more support for wiktionary grammar templates
* tweak some regexes
### 5.2.0
* make `.json()` results return proper json for tables
### 5.3.0
* add infobox html back into html output (tentative)
* redirect support in .json(), .html() output
* remove empty `[]` properties in .json() results (saves disk space!)
* keep `#` anchor data in .links()
* show links default-on in latex output, like in md and html
* render html/latex/json 'soft redirect', instead of blank pages

## 6.0.0 🚨
* support `.paragraphs()`
* :warning: major changes to output of `.json()`. cleaning-up redundant data.:warning:
* * remove top-level `templates` data (found in `section`) - resume it with `{templates:true}`
* * remove top-level `coordinates` data (found in `templates`) - resume it with `{coordinates:true}`
* * remove top-level `citations` data (found in `section`) - resume it with `{citations:true}`
* return empty arrays in `.json()` again  ¯\_(:/)_ /¯
* remove <h1> title on html output
* change ambiguous `options.title` for sections to `options.headers`
* support lists of 1
* begin removing empty references section by default
* begin support for rendering citations at the bottom of documents
* begin first-class references-parsing as objects at paragraph-level
  - use this:  `.citations()` --> `.citations().map(c => c.json());`
* remove `.wikitext()` and `.reparse()` methods - keeping wikitext stateful caused too many issues
* turn `Image.file` into a function
* include `interwiki()` results in `.links()`
* support `follow_redirects` option to fetch
* hide object data in console.logs
* move ALL image urls from `upload.wikimedia.org/wikipedia/commons` to `wikipedia.org/wiki/Special:Redirect/file/` via #86
* image captions are now Sentence objects
* rename citation → reference internally, and in json output
* remove references inside section titles
### 6.1.0
* titlecase internal link destinations #192
### 6.2.0
* support categories in redirects
* add mongo-encoding from dumpster-dive
### 6.3.0
* support way (+20%?) more templates.
