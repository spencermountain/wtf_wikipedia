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

Some helper methods for getting additional data from the wikimedia api.

These methods simply grab data from the [wikipedia api](https://www.mediawiki.org/wiki/API:Main_page). 

Please use the wikipedia API respectfully. They are not meant to be used at high-volumes.
If you are seeking information on for many wikipedia pages, consider [parsing the dump](https://github.com/spencermountain/dumpster-dive/) instead.

### Redirects
[Redirects](https://en.wikipedia.org/wiki/Wikipedia:Redirect) are an assortment of alternative names and mis-spellings for a wikipedia page.
They can be a rich source of linguistic data. On wikipedia, you can see all the redirects for a page [here](https://en.wikipedia.org/w/index.php?title=Special%3AWhatLinksHere&hidetrans=1&hidelinks=1&target=Toronto+Raptors&namespace=)

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
  ...
]
*/

```

### Incoming links
You can also get all pages that link to this page.
```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-api'))

// get all pages that link to this document
let doc = await wtf.fetch('Toronto Raptors')
let list = await doc.incomingLinks()
console.log(list)
/*
[
  { title: 'Toronto' },
  { title: 'Jurassic Park (film)' },
  { title: 'National Basketball Association' },
  ...
]
*/
```
By default, this method only returns full pages, and not redirects, or talk-pages.


### Page views
Wikipedia provides daily [page-view information](https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bpageviews) providing a rough metric on a topic's popularity.
```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-api'))

let doc = await wtf.fetch('Toronto Raptors')
let byDay = await doc.pageViews()
console.log(byDay)
/*
{
  '2020-08-30': 4464,
  '2020-08-31': 2739,
  '2020-09-01': 3774,
  '2020-09-02': 3347,
  '2020-09-03': 3569,
  ...
}
*/
```

### API

* **doc.redirects()** - fetch all pages that redirect to this document
* **doc.incomingLinks()** - fetch all pages that link to this document
* **doc.pageViews()** - daily traffic report for this document



MIT
