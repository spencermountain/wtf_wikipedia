<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-api">
    <img src="https://img.shields.io/npm/v/wtf-plugin-image.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-markdown/builds/wtf-plugin-api.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-api/master/builds/wtf-plugin-api.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-api</code>
</div>

Some additional methods for getting data from the wikimedia api

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-api'))

// fetch all a page's redirects
let doc = await wtf.fetch('Toronto Raptors')
let redirects = await doc.redirects()
console.log(redirects)
/*
[
  { title: 'the raptors' },
  { title: 'We The North' },
]
*/

```

### API

* **doc.redirects()** - fetch all pages that redirect to this document


MIT
