<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-mixesdb">
    <img src="https://img.shields.io/npm/v/wtf-plugin-mixesdb.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <!-- <a href="https://unpkg.com/wtf-plugin-wikinews/builds/wtf-plugin-mixesdb.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-wikinews/master/builds/wtf-plugin-wikinews.min.js" />
  </a> -->
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-mixesdb</code>
</div>

A work-in-progress plugin that provides support for infoboxes and templates from the [mixesdb wiki](https://www.mixesdb.com/w/Main_Page).

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-mixesdb'))
;(async () => {
  await wtf.fetch('2020-12-23_-_Hyroglifics_-_Last_Planet_Mix').json()
})()
```

MIT
