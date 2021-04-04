<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-markdown">
    <img src="https://img.shields.io/npm/v/wtf-plugin-markdown.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-markdown/builds/wtf-plugin-markdown.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-markdown/master/builds/wtf-plugin-markdown.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-markdown</code>
</div>

Some additional conjugation of adjectives

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-markdown'))

let doc = wtf('hello [[world]]')
doc.markdown()
// 'hello <a href="./world">world</a>'
```

work-in-progress

MIT
