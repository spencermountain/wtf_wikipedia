import test from 'tape'
import wtf from '../../lib/index.js'

test('images from every source use the document domain', (t) => {
  const doc = wtf(`
{{Infobox company|image=Company logo.png}}
[[File:Inline.png|thumb|Inline caption]]
<gallery>File:Gallery.png|Gallery caption</gallery>
{{Gallery|File:Template.png|Template caption}}
`, { domain: 'example.org', pageImage: 'Page image.png' })
  const images = doc.images()
  t.equal(images.length, 5, 'includes metadata, infobox, inline, and both gallery forms')
  images.forEach((image) => {
    t.ok(image.url().startsWith('https://example.org/'), image.file())
  })
  t.ok(doc.infobox().images()[0].url().startsWith('https://example.org/'), 'direct infobox access uses domain')
  t.ok(doc.sections()[0].images()[0].url().startsWith('https://example.org/'), 'direct section access uses domain')
  t.equal(images[0].wikitext(), '', 'metadata has no source markup')
  doc.domain = 'updated.example.org'
  doc.images().forEach((image) => {
    t.ok(image.url().startsWith('https://updated.example.org/'), `updated domain: ${image.file()}`)
  })
  t.end()
})

test('infobox image markup retains alt text and caption links', (t) => {
  const wiki = '[[Datei:Company logo.png|thumb|alt=Company emblem|A [[Logo]]]]'
  const doc = wtf(`{{Infobox company|image=${wiki}}}`)
  const image = doc.infobox().images()[0]
  t.equal(image.file(), 'File:Company_logo.png', 'normalizes the filename')
  t.equal(image.alt(), 'Company emblem', 'retains explicit alt text')
  t.equal(image.caption(), 'A Logo', 'retains embedded caption')
  t.equal(image.links()[0].page(), 'Logo', 'retains caption link')
  t.equal(image.wikitext(), wiki, 'retains original markup')
  t.deepEqual(doc.images()[0].json(), image.json(), 'document and infobox expose the same image data')
  t.end()
})

test('infobox caption overrides embedded image caption', (t) => {
  const doc = wtf('{{Infobox company|image=[[File:Logo.png|Embedded caption]]|caption=Separate [[Caption]]}}')
  const image = doc.infobox().images()[0]
  t.equal(image.caption(), 'Separate Caption', 'uses explicit infobox caption')
  t.equal(image.links()[0].page(), 'Caption', 'uses explicit caption links')
  t.end()
})

test('colon-prefixed file links remain links', (t) => {
  const doc = wtf('[[:File:Logo.png|View logo]]')
  t.equal(doc.images().length, 0, 'does not turn a file link into an image')
  t.equal(doc.links().length, 1, 'retains the link')
  t.end()
})
