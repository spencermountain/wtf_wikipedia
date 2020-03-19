<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-summary">
    <img src="https://img.shields.io/npm/v/wtf-plugin-summary.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-summary/builds/wtf-plugin-summary.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-summary.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-summary</code>
</div>

Tries to generate a small fragment of text (or 'clause') that describes a wikipedia article in english.

Generally, it grabs and processes the first-sentence of a wikipedia article, but it may also fallback to other data.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-summary'))

wtf.fetch('Toronto Raptors', 'en').then(doc => {
  let txt = doc.summary()
  // 'a Canadian professional basketball team'
})
```

work-in-progress

MIT
