Instructions for parsing OpenStreetMap's wiki at [https://wiki.openstreetmap.org](https://wiki.openstreetmap.org)


```js
wtf.extend(require('./plugin.js'))
```

The OSM wiki api uses a custom path:
```js
wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway', { path: '/w/api.php' }).then((doc) => {
  console.log(doc.templates('ValueDescription'))
})
```

Some of the data in the osm wiki, such as [Map_features](https://wiki.openstreetmap.org/wiki/Map_features) is generated dynamically through [{{Taglist}}](https://wiki.openstreetmap.org/wiki/Taginfo/Taglists), which means it cannot be retrieved.

