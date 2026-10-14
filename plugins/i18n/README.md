<div align="center">
  <div><b>wtf-plugin-i18n</b></div>
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-i18n">
    <img src="https://img.shields.io/npm/v/wtf-plugin-i18n.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-i18n/builds/wtf-plugin-i18n.min.js">
    <img src="https://img.shields.io/bundlephobia/min/wtf-plugin-i18n" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-i18n</code>
</div>

This plugin adds support for many additional multi-language templates in wtf_wikipedia.

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-i18n'))

//'flag' template in arabic wikipedia
wtf('hello world {{علم|EU}}').text()
// 'hello world 🇪🇺'

let doc = wtf(`{{Cita libru |url=cool.com |title= citation template }}`)
doc.references().length
// 1
```



```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script src="https://unpkg.com/wtf-plugin-i18n"></script>
<script defer>
  wtf.plugin(window.wtfI18n)
  wtf.fetch('https://de.wikipedia.org/wiki/Hamburg').then((doc) => {
    console.log(doc.coordinates())
  })
</script>
```

work-in-progress

MIT
