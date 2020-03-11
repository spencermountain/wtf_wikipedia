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
doc.wikitext()
// 'hello [[world]]'
```

work-in-progress

MIT
