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
