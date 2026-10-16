<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-wiktionary">
    <img src="https://img.shields.io/npm/v/wtf-plugin-wiktionary.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-wiktionary/builds/wtf-plugin-wiktionary.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-wiktionary/master/builds/wtf-plugin-wiktionary.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-wiktionary</code>
</div>

A work-in-progress plugin that provides support for infoboxes and templates from the wiktionary project.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-wiktionary'))
;(async () => {
  await wtf.fetch('scrumptious','wiktionary').json()
})()
```

MIT