var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Quartz', 'en').then((doc) => {
//   // console.log(doc.lang())
//   console.log(doc.images().map((j) => j.url()))
// })

let str = `{{Gallery
|title=Cultural depictions of George Washington
|width=160 | height=170
|align=center
|footer=Example 1
|File:VeryCool.JPG
|alt1=Statue facing a city building with Greek columns and huge U.S. flag
}}`

let doc = wtf(str, { domain: 'cool.com' })
console.log(doc.template())
// console.log(doc.infobox().image().url())
// console.log(doc.images().map((img) => img.url()))

wtf.fetch('https://doom.fandom.com/wiki/Samuel_Hayden').then((doc) => {
  console.log(doc.images().map((img) => img.url()))
})
