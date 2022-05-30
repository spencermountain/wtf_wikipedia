<div align="center">
  <div><b>wtf-plugin-image</b></div>
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-image">
    <img src="https://img.shields.io/npm/v/wtf-plugin-image.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-image/builds/wtf-plugin-image.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf_wikipedia/master/plugins/image/builds/wtf-plugin-image.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-image</code>
</div>

Some additional methods for using and rendering images in wtf_wikipedia

```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-image'))

wtf.fetch('casa', { lang:'it', wiki: `wiktionary` }).then(async function(doc) {
  let image = doc.images()[0]

  // make a {method: 'HEAD'} request to test the image is there
  let bool = await image.exists()

  // instead of using the redirect api, generate a direct img url
  let url = image.commonsURL()
  // https://upload.wikimedia.org/wikipedia/commons/4/4e/RybnoeDistrict_06-13_Konstantinovo_village_05.jpg

  let img = doc.mainImage()
  //
  // make a request to get the license and attribution information (results are HTML formatted)
  let license = await image.license()
  /* 
  {
    license: 'CC BY-SA 3.0',
    artist: '<b><span class="plainlinks"> ... (more HTML)',
    credit: '<span class="int-own-work" lang="en">Own work</span>',
    attributionRequired: 'true'
  }
  */
})
```

```html
<script src="https://unpkg.com/wtf_wikipedia"></script>
<script src="https://unpkg.com/wtf-plugin-images"></script>
<script defer>
  wtf.plugin(window.wtfImage)
  wtf.fetch('Hamburg').then((doc) => {
    console.log(doc.mainImage().thumb())
    // https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_Hamburg.svg?width=300
  })
</script>
```

The document's `images` method now also accepts an options object as its argument, possible options are:
- `batch`  
  Request-making methods that you want to call for all the images. (a string for one or array for more)  
  It's a best practice as it prevents overwhelming the wiki's servers by making one request for all the  
  images beforehand instead of multiple. (the return value of `images` would be a Promise)

```js
let images = await doc.images({batch: ['license', 'exists']}) // note the "await"
let image = images[0]

// even though they don't make requests, they still return Promises for consistency 
let bool = await image.exists()
let license = await image.license()
```

plugin also has a method for choosing a good, or representative image for this page, if it exists:
```js
// choose a good image for this article
let doc = await wtf.fetch('Toronto')
let img = doc.mainImage()
console.log(img.src())
// https://wikipedia.org/wiki/Special:Redirect/file/Toronto_Flag.svg
```

### API

- **image.exists()** - double-check that the image is on the server
- **image.commonsURL()** - instead of the wikimedia redirect server, generate a url for the commons server.
- **image.mainImage()** - get only an image that should represent this topic, as a thumbnail.
- **image.license()** - get license and attribution information for the image.
- **document.images()** - accepts an options object as argument.

MIT
