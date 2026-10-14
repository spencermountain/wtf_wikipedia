import test from 'tape'
import wtf from '../../lib/index.js'

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

test('infobox image options do not leak into filenames', (t) => {
  const doc = wtf('{{Infobox company|image=[[File:Company logo.png|thumb|200px|A logo]]}}')
  t.equal(doc.image().file(), 'File:Company_logo.png')
  t.equal(doc.image().url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Company_logo.png')
  t.end()
})
