import test from 'tape'
import wtf from '../lib/index.js'

test('infobox image markup is normalized to a filename', (t) => {
  const doc = wtf('{{Infobox Unternehmen|Logo=[[Datei:BBDO Logo.png]]}}')
  const image = doc.image()

  t.equal(image.file(), 'File:BBDO_Logo.png', 'strips brackets and normalizes the image namespace')
  t.equal(
    image.url(),
    'https://wikipedia.org/wiki/Special:Redirect/file/BBDO_Logo.png',
    'image URL contains only the filename'
  )
  t.end()
})
