<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-wikispecies">
    <img src="https://img.shields.io/npm/v/wtf-plugin-wikinews.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <!-- <a href="https://unpkg.com/wtf-plugin-wikispecies">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf_wikipedia/plugins/wikis/wikispecies/builds/wtf-plugin-wikispecies.min.js" />
  </a> -->
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-wikispecies</code>
</div>

A work-in-progress plugin that provides support for infoboxes and templates from the [species.wikimedia.org](https://species.wikimedia.org/).

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-wikispecies'))
;(async () => {
  await wtf.fetch('Balistapus undulatus').json()
})()
```

MIT
