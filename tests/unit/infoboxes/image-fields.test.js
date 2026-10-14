import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Vietnamese-Artwork-Image', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Vi'))
  t.ok(
    doc.images().some((image) => image.file() === 'File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'),
    'artwork image_file is extracted'
  )
  t.end()
})

test('additional infobox image fields normalize filenames', (t) => {
  const cases = [
    ['image_file', 'Example image.jpg'],
    ['画像', '[[ファイル:Example image.jpg|250px]]'],
  ]
  cases.forEach(([field, value]) => {
    const doc = wtf(`{{Infobox test|${field}=${value}}}`, { domain: 'example.org' })
    t.equal(doc.infobox().image().file(), 'File:Example_image.jpg', field)
    t.equal(doc.image().url(), 'https://example.org/wiki/Special:Redirect/file/Example_image.jpg', field)
  })
  const doc = wtf('{{Infobox test|image=Primary.jpg|image_file=Secondary.jpg|画像=Third.jpg}}')
  t.equal(doc.image().file(), 'File:Primary.jpg', 'existing image field keeps precedence')
  t.end()
})
