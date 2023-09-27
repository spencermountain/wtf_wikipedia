import wtf from './src/index.js'
console.log('start')

let str = `hello
{{usableitinerary}}
{{PartOfItinerary|North America itineraries}}
<maplink text="" zoom="5" group="route1" class="no-icon">

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
                        [
                            -117.02964,
                            32.54259
                        ],
                        [
                            -117.03059,
                            32.54305
                        ]

        ]
      }
    }
  ]
}

</maplink>
`
// let doc = wtf(str)
const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Interstate_5');

console.log(doc.text());
