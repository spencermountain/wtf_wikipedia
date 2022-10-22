import test from 'tape'
import wtf from '../../lib/index.js'

// file
test('file - should return the "title" of the image', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].file(), 'File:X-4_with_Female_Computer_-_GPN-2000-001932.jpg', 'file')
  t.end()
})

test('file - should return the "title" of the image and added File: to it', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].file(), 'File:X-4_with_Female_Computer_-_GPN-2000-001932.jpg', 'file')
  t.end()
})

test('file - should return the "title" of the image it and title cased it and added underscore', (t) => {
  const doc = wtf(`[[file:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].file(), 'File:X-4_with_Female_Computer_-_GPN-2000-001932.jpg', 'file')
  t.end()
})

// alt

test('alt - should return the alt text of the image', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].alt(), 'A human computer.', 'alt')
  t.end()
})

test('alt - should return the name if there is no alt', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952]]`)
  t.equal(doc.images(0)[0].alt(), 'X-4 with Female Computer - GPN-2000-001932', 'alt')
  t.end()
})

// caption
test('caption - should return the caption of the image', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|A human computer, with microscope and calculator, 1952|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].caption(), 'A human computer, with microscope and calculator, 1952', 'caption')
  t.end()
})

test('caption - should return empty string if there is no caption', (t) => {
  const doc = wtf(`[[File:X-4 with Female Computer - GPN-2000-001932.jpg|thumb|upright=1.15|alt=A human computer.]]`)
  t.equal(doc.images(0)[0].caption(), '', 'caption')
  t.end()
})


// links

test('links - should return links in the caption', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the ''Cordeliere'' (bearing the [[Kroaz Du|Flag of Brittany]]) and ''Regent'' (with the [[Flag of England]]) on fire. Illustration to the poem ''Chordigerae navis conflagratio'' by [[Germain de Brie]].]]`)
  t.deepEqual(doc.images(0)[0]
    .links()
    .map(link => link.wikitext()),
  [

  ],
  'links',
  )
  t.end()
})

test('links - if there is no caption then there are no links', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.deepEqual(doc.images(0)[0].links(), [], 'links')
  t.end()
})

test('links - should return an array even if there is no links in the caption', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the ''Cordeliere'']]`)
  t.deepEqual(doc.images(0)[0].links(), [], 'links')
  t.end()
})


// url
test('url - should return the url of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg', 'url')
  t.end()
})

// thumbnail

test('thumbnail - should return the thumbnail of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].thumbnail(), 'https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg?width=300', 'url')
  t.end()
})

test('thumbnail - should return the thumbnail of the image and should accept a size', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].thumbnail(400), 'https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg?width=400', 'url')
  t.end()
})

// format
test('format - should return the format of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].format(), 'jpg', 'format')
  t.end()
})

// json
test('json - should return the json of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the ''Cordeliere'']]`)
  t.deepEqual(doc.images(0)[0].json(), {
    "file": "File:Cordeliere_and_Regent.jpg",
    "thumb": "https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg?width=300",
    "url": "https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg",
    "caption": "A contemporary image of the Cordeliere",
    "links": [],
  }, 'json')
  t.end()
})

// text
test('text - should return the text of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the ''Cordeliere'']]`)
  t.equal(doc.images(0)[0].text(), '', 'text')
  t.end()
})

// wikitext
test('wikitext - should return the wikitext of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the ''Cordeliere'']]`)
  t.equal(doc.images(0)[0].wikitext(), '[[File:Cordeliere and Regent.jpg|thumb|A contemporary image of the \'\'Cordeliere\'\']]', 'wikitext')
  t.end()
})

// src
test('src - should return the src of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].src(), 'https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg', 'url')
  t.end()
})

// thumb
test('thumb - should return the thumb of the image', (t) => {
  const doc = wtf(`[[File:Cordeliere and Regent.jpg|thumb|]]`)
  t.equal(doc.images(0)[0].thumb(), 'https://wikipedia.org/wiki/Special:Redirect/file/Cordeliere_and_Regent.jpg?width=300', 'url')
  t.end()
})