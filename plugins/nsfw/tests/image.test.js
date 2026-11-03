import test from 'tape'
import wtf from './_lib.js'

// entries from https://en.wikipedia.org/wiki/MediaWiki:Bad_image_list
const BAD = 'Penis anatomy.jpg'
const BAD_UPPER = 'Anatomy2.JPG'
const BAD_PNG = 'Stormfrontlogo.png'
const BAD_UNICODE = '음경의 외부모습.jpg'

test('image detection', function (t) {
  let res = wtf(`[[File:${BAD}|thumb|caption]]\nSome text.`).nsfw()
  t.equal(res.length, 1, 'inline file link')
  t.equal(res[0].type, 'obscenity', 'type')
  t.equal(res[0].evidence[0].source, 'image', 'evidence source')
  t.equal(res[0].evidence[0].name, BAD.toLowerCase(), 'evidence name')
  t.equal(res[0].evidence[0].data.file, 'File:Penis_anatomy.jpg', 'full image json attached')

  res = wtf(`[[File:${BAD.replace(/ /g, '_')}]]`).nsfw()
  t.equal(res.length, 1, 'underscores instead of spaces')

  res = wtf(`[[Image:${BAD}]]`).nsfw()
  t.equal(res.length, 1, 'Image: prefix')

  res = wtf(`[[File:${BAD.toUpperCase()}]]`).nsfw()
  t.equal(res.length, 1, 'case-insensitive')

  res = wtf(`[[File:${BAD_UPPER.toLowerCase()}]]`).nsfw()
  t.equal(res.length, 1, 'list entry with uppercase extension')

  res = wtf(`[[File:${BAD_PNG}]]`).nsfw()
  t.equal(res.length, 1, 'png file')

  res = wtf(`[[File:${BAD_UNICODE}]]`).nsfw()
  t.equal(res.length, 1, 'non-latin file name')

  res = wtf(`{{Infobox person\n| name = Foo\n| image = ${BAD}\n}}\nFoo is a person.`).nsfw()
  t.equal(res.length, 1, 'infobox image')

  res = wtf(`<gallery>\nFile:${BAD}|caption\n</gallery>`).nsfw()
  t.equal(res.length, 1, 'gallery image')

  res = wtf(`[[File:${BAD}]]\n[[File:${BAD_PNG}]]`).nsfw()
  t.equal(res[0].evidence.length, 2, 'every bad image is reported')
  t.end()
})

test('image negatives', function (t) {
  t.deepEqual(wtf('[[File:Toronto skyline.jpg|thumb]]').nsfw(), [], 'unknown image')
  t.deepEqual(wtf('{{Infobox city\n| image = Toronto skyline.jpg\n}}').nsfw(), [], 'unknown infobox image')
  t.deepEqual(wtf(`[[File:Not ${BAD}]]`).nsfw(), [], 'no substring matching')
  t.end()
})
