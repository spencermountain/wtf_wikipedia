var test = require('tape')
var wtf = require('./lib')

test('domain - normal', (t) => {
  let str = `hello [[File:SpencerKelly.jpg]] world`
  let doc = wtf(str, { domain: 'cool.com' })
  let img = doc.images(0).url()
  t.equal(img, 'https://cool.com/wiki/Special:Redirect/file/SpencerKelly.jpg', 'set new domain - normal')
  t.end()
})

test('domain - xml gallery', (t) => {
  let str = `<gallery>
File:YYZ Aerial 2.jpg
</gallery>`
  let doc = wtf(str, { domain: 'cool.com' })
  let img = doc.images(0).url()
  t.equal(img, 'https://cool.com/wiki/Special:Redirect/file/YYZ_Aerial_2.jpg', 'set new domain - xml')
  t.end()
})

test('domain - template gallery', (t) => {
  let str = `{{Gallery
|title=Cultural depictions of George Washington
|width=160 | height=170
|align=center
|footer=Example 1
|File:VeryCool.JPG 
|alt1=Statue facing a city building with Greek columns and huge U.S. flag
}}`
  let doc = wtf(str, { domain: 'verycool.com' })
  let img = doc.images(0).url()
  t.equal(img, 'https://verycool.com/wiki/Special:Redirect/file/VeryCool.JPG', 'set new domain - template')
  t.end()
})

test('domain - infobox', (t) => {
  let str = `{{Infobox settlement
| name = New York City
| image                   = Cool.jpg
}}`
  let doc = wtf(str, { domain: 'cool.com' })
  let img = doc.images(0).url()
  t.equal(img, 'https://cool.com/wiki/Special:Redirect/file/Cool.jpg', 'set new domain - infobox')

  img = doc.infobox().image().url()
  t.equal(img, 'https://cool.com/wiki/Special:Redirect/file/Cool.jpg', 'set new domain - infobox-direct')
  t.end()
})
