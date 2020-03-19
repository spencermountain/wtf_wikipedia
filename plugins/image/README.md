<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-image">
    <img src="https://img.shields.io/npm/v/wtf-plugin-image.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-markdown/builds/wtf-plugin-image.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-image/master/builds/wtf-plugin-image.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-image</code>
</div>

Some additional methods for using and rendering images in wtf_wikipedia

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-markdown'))

wtf.fetch('casa', 'it', { wiki: `wiktionary` }).then(async function(doc) {
  let image = doc.images(0)

  // make a {method: 'HEAD'} request to test the image is there
  let bool = await image.exists()

  //instead of using the redirect api, generate a direct img url
  let url = image.commonsURL()
  //https://upload.wikimedia.org/wikipedia/commons/4/4e/RybnoeDistrict_06-13_Konstantinovo_village_05.jpg
})
```

### API

- **image.exists()** - double-check that the image is on the server
- **image.commonsURL()** - instead of the wikimedia redirect server, generate a url for the commons server.

MIT
