import test from 'tape'
import wtf from '../../lib/index.js'

test('additional infobox image fields normalize filenames', (t) => {
  const cases = [
    ['image_file', 'Example image.jpg'],
    ['画像', '[[ファイル:Example image.jpg|250px]]'],
  ]
  cases.forEach(([field, value]) => {
    const doc = wtf(`{{Infobox test|${field}=${value}}}`, { domain: 'example.org' })
    t.equal(doc.infobox().images()[0].file(), 'File:Example_image.jpg', field)
    t.equal(doc.images()[0].url(), 'https://example.org/wiki/Special:Redirect/file/Example_image.jpg', field)
  })
  const doc = wtf('{{Infobox test|image=Primary.jpg|image_file=Secondary.jpg|画像=Third.jpg}}')
  t.equal(doc.images()[0].file(), 'File:Primary.jpg', 'existing image field keeps precedence')
  t.end()
})
