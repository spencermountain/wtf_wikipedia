<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-latex">
    <img src="https://img.shields.io/npm/v/wtf-plugin-latex.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-latex/builds/wtf-plugin-latex.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-latex/master/builds/wtf-plugin-latex.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-latex</code>
</div>

Output all, or parts of a wikipedia article in LATEX format.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-latex'))

let doc = wtf('hello [[world]]')
doc.latex()
// 'hello \href{./world}{world}'
```

work-in-progress

MIT
