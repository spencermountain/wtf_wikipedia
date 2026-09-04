import test from 'tape'
import wtf from '../lib/index.js'

test('nihongo templates templates', (t) => {
  let str = `hello {{Nihongo|Tokyo Tower|東京タワー|Tōkyō tawā}} world`
  let doc = wtf(str)
  t.equal(doc.text(), 'hello Tokyo Tower (東京タワー) world', 'sub english word')
  t.equal(doc.templates().length, 1, 'have template')
  t.equal(doc.template(0).json().romaji, 'Tōkyō tawā', 'have translation')

  str = `In Japanese, {{Nihongo2|虚無僧}} reads ''komusō''.`
  doc = wtf(str)
  t.equal(doc.text(), 'In Japanese, 虚無僧 reads komusō.', 'sub kanji word')

  str = `{{Nihongo foot|English|Kanji|Rōmaji|extra|extra2|group=group}}`
  doc = wtf(str)
  t.equal(doc.text(), 'English (Kanji)', 'footnote kinda')
  t.end()
})

test('hindi image', (t) => {
  const str = `[[चित्र:Gandhis ashes.jpg|thumb|left|[[राज घाट और अन्य स्मारक|राज घाट]] ([[:en:Raj Ghat and other memorials|Raj Ghat]]):आगा खान पैलेस में गांधी की अस्थियां (पुणे, भारत) .]]`
  const img = wtf(str).image(0).json()
  t.equal(img.file, 'File:चित्र:Gandhis_ashes.jpg')
  t.end()
})

test('hindi categories', (t) => {
  const str = `
  [[श्रेणी:भारत के अर्थशास्त्री]]
  [[श्रेणी:महात्मा गांधी| ]]`
  const img = wtf(str).json()
  t.equal(img.categories[0], 'भारत के अर्थशास्त्री', 'cat1')
  t.equal(img.categories[1], 'महात्मा गांधी', 'cat2')
  t.end()
})

test('lang template', (t) => {
  let str = `i played {{lang-de|Die Seefahrer von Catan}}`
  let doc = wtf(str)
  t.equal(doc.text(), 'i played Die Seefahrer von Catan', 'lang-de')

  str = `hi there {{lang-ru|тундра|italic=unset}} hello`
  doc = wtf(str)
  t.equal(doc.text(), 'hi there тундра hello', 'ru text')

  str = `{{lang|fr|Je suis française.}}`
  doc = wtf(str)
  t.equal(doc.text(), 'Je suis française.', 'lang tag text')
  t.end()
})
