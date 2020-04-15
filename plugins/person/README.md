<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-person">
    <img src="https://img.shields.io/npm/v/wtf-plugin-person.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-person/builds/wtf-plugin-person.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-person.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-person</code>
</div>

A plugin that finds `name, birth date, birth place, nationality`, and `death date` information, in its various places in a wikipedia article.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-person'))
;(async () => {
  await wtf.fetch('David Phillips (entrepreneur)').birthDate()
  // {year: 1964, month:null, date:null}
})()
```

## Notes:

This library assumes that every article you give it is about a person. You may want to use it in conjunction with [wtf-plugin-classify](https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins/classify)
to ensure that a page is first about a person, and not a place, or musical group:

```js
wtf.fetch('Billy Elliot').then((doc) => {
  let res = doc.classify() // 'CreativeWork/Play'
  if (res.root === 'Person') {
    console.log(doc.birthPlace())
  }
})
```

### BirthDate

- looks at varous person-infoboxes, like `Infobox officeholder` or `Infobox ice hockey player`
- looks at first-sentence parentheses, like `'Wayne Douglas Gretzky CC (/ˈɡrɛtski/; born January 26, 1961) is a ...'`
- looks at category information, like `'Category:1933 births'` or `Category:Dead people`

### BirthPlace

- looks at varous person infoboxes

work-in-progress

MIT
