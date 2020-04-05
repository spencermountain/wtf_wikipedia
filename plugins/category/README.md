<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-category">
    <img src="https://img.shields.io/npm/v/wtf-plugin-category.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-category/builds/wtf-plugin-category.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-category/master/builds/wtf-plugin-category.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-category</code>
</div>

This plugin allows fetching and parsing all articles in a Wikipedia Category.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-category'))

// get the first sentence of all MLB stadiums:
wtf.parseCategory('Major League Baseball venues').then(docs => {
  let arr = docs.map(doc => {
    return doc.sentence().text()
  })
  // [
  //  'Fenway park is a sports complex and major league baseball stadium...',
  //  'Rogers Center is a entertainment venue ...'
  //]
})

// get the name of a random category
let cat = await wtf.randomCategory('fr')
// 'Catégorie:Édifice religieux à Paris'
```

work-in-progress

MIT
