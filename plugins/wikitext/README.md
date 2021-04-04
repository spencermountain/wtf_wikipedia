<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-wikitext">
    <img src="https://img.shields.io/npm/v/wtf-plugin-wikitext.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-html/builds/wtf-plugin-wikitext.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-wikitext.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-wikitext</code>
</div>

Output all, or part of a wikipedia article in wiki-script.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-wikitext'))

let doc = wtf('hello [[world]]')
doc.makeWikitext()
// 'hello [[world]]'
```

all wtf_wikipedia models have a `.wikitext()` method that (tries to) return their original wikitext.
This method will try to \_generate\* the wikitext, as best it can. This is a lossy, and error-prone process, but may be useful for some applications.

```js
let doc = wtf(`hello [[world]]. {{cool|fun=yes}}`)
let tmpl = doc.template()
console.log(tmpl.makeWikitext())
// {{cool| fun = yes}}

tmpl.data.more = 'yes'
console.log(tmpl.makeWikitext())
// {{cool| fun = yes| more = yes}}
```

Concievably, this could be part of a edit-bot workflow, although there are many unresolved problems still, to doing so.

work-in-progress!

PRs welcome

MIT
