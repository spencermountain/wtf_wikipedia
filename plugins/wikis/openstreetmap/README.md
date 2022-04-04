<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-openstreetmap">
    <img src="https://img.shields.io/npm/v/wtf-plugin-openstreetmap.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-openstreetmap/builds/wtf-plugin-openstreetmap.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-openstreetmap/master/builds/wtf-plugin-openstreetmap.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-openstreetmap</code>
</div>

Instructions for parsing OpenStreetMap's wiki at [https://wiki.openstreetmap.org](https://wiki.openstreetmap.org)


```js
wtf.extend(require('wtf-plugin-openstreetmap'))
```

The OSM wiki api uses a custom path:
```js
wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway', { path: '/w/api.php' }).then((doc) => {
  console.log(doc.templates('ValueDescription'))
})
```

Some of the data in the osm wiki, such as [Map_features](https://wiki.openstreetmap.org/wiki/Map_features) is generated dynamically through [{{Taglist}}](https://wiki.openstreetmap.org/wiki/Taginfo/Taglists), which means it cannot be retrieved.

MIT