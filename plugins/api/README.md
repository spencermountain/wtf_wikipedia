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

the main `wtf_wikipedia` library has a few basic methods for fetching data from the [wikipedia api](https://www.mediawiki.org/wiki/API:Main_page) - 
you can get an article with `.fetch()`, a category with `.category()` or a random page with `.random()`.

There are a bunch of cool ways to get data from the API though, and this plugin tries to help with that.

Please use the wikipedia API respectfully. This is not meant to be used at high-volumes.
If you are seeking information on for many wikipedia pages, consider [parsing the dump](https://github.com/spencermountain/dumpster-dive/) instead.
There are also ways to batch requests, to reduce strain on wikimedia servers. These methods are meant to be simple wrappers for quick access.

Where appropriate, this plugin throttles requests to max 3 at-a-time.

to install:
```js
const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-api'))
```

## Page Redirects
[Redirects](https://en.wikipedia.org/wiki/Wikipedia:Redirect) are an assortment of alternative names and mis-spellings for a wikipedia page.
They can be a rich source of linguistic data. On wikipedia, you can see all the redirects for a page [here](https://en.wikipedia.org/w/index.php?title=Special%3AWhatLinksHere&hidetrans=1&hidelinks=1&target=Toronto+Raptors&namespace=)

```js
// fetch all a page's redirects
let doc = await wtf.fetch('Toronto Raptors')
let redirects = await doc.getRedirects()
console.log(redirects)
/*
[
  { title: 'the raptors' },
  { title: 'We The North' },
  ...
]
*/

```

## Incoming links
You can also get all pages that link to this page.
```js
// get all pages that link to this document
let doc = await wtf.fetch('Toronto Raptors')
let list = await doc.getIncoming()
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


## Page views
Wikipedia provides daily [page-view information](https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bpageviews) providing a rough metric on a topic's popularity.
```js
let doc = await wtf.fetch('Toronto Raptors')
let byDay = await doc.getPageViews()
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

## Random Category
get the name of a random wikipedia category, from a given wiki
```js
wtf.getRandomCategory({lang:'fr'}).then(cat=>{
  console.log(cat)
  // 'Catégorie:Édifice religieux à Paris'
})
```

## Category Pages
fetch+parse all documents in a given category, to a specific depth.
```js
// get the first sentence of all MLB stadiums:
wtf.getCategoryPages('Major League Baseball venues').then(docs => {
  docs.map(doc => doc.sentence(0).text())
  // [
  //  'Fenway park is a sports complex and major league baseball stadium...',
  //  'Rogers Center is a entertainment venue ...'
  //]
})
```


## Template pages
Sometimes you want to get all the data for one infobox, or template - in all the pages it belongs to.
You can see a list pages of a specific template with [this tool](https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Template:Infobox_medical_condition_(new)&hidelinks=1&limit=500), and you can get a approximate count of pages with [this tool](https://templatecount.toolforge.org/index.php?lang=en&namespace=10&name=Infobox_medical_condition_(new)#bottom)

This method fetches+parses all documents that use (aka 'transclude') a specific template or infobox.
You can get the name of the template from viewing the page's source. Sometimes you need to add a 'Template: ' to the start of it, sometimes you don't.

to 
```js
// parse all the chefs wikipedia articles
wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub').then(docs => {
  docs.forEach(doc => {
    let height=doc.infobox(0).get('height')
    console.log(doc.title(), height)
  })
})
```
---
## API

* **doc.getRedirects()** - fetch all pages that redirect to this document
* **doc.getIncoming()** - fetch all pages that link to this document
* **doc.getPageViews()** - daily traffic report for this document

* **wtf.getRandomCategory()** - 
* **wtf.getTemplatePages()** - 
* **wtf.getCategoryPages()** - 

MIT
