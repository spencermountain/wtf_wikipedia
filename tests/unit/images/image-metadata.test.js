import test from 'tape'
import wtf from '../../lib/index.js'

test('gallery alt text belongs to its numbered image', (t) => {
  const doc = wtf('{{Gallery|File:One.png|First [[Caption]]|File:Two.png|Second caption|alt1=First emblem|alt2=Second emblem}}')
  const images = doc.images()
  t.equal(images[0].alt(), 'First emblem', 'first alt text')
  t.equal(images[1].alt(), 'Second emblem', 'second alt text')
  t.equal(images[0].caption(), 'First Caption', 'caption remains separate')
  t.equal(images[0].links()[0].page(), 'Caption', 'caption link survives')
  t.equal(doc.template().json().data.images[1].alt, 'Second emblem', 'stored in gallery data')
  t.end()
})

test('gallery missing alt text does not shift numbering', (t) => {
  const images = wtf('{{Gallery|File:One.png|First|File:Two.png|Second|alt2=Second emblem}}').images()
  t.equal(images[0].json().alt, undefined, 'first image has no explicit alt')
  t.equal(images[1].json().alt, 'Second emblem', 'second image keeps alt2')
  t.end()
})

test('infobox second image uses caption2', (t) => {
  const images = wtf('{{Infobox company|image=One.png|image2=Two.png|caption=First [[Caption]]|caption2=Second [[Caption]]}}').infobox().images()
  t.equal(images[0].caption(), 'First Caption', 'first caption')
  t.equal(images[1].caption(), 'Second Caption', 'second caption')
  t.equal(images[1].links()[0].page(), 'Caption', 'second caption retains links')
  t.end()
})

test('missing caption2 preserves the embedded second caption', (t) => {
  const image = wtf('{{Infobox company|image2=[[File:Two.png|Embedded [[Caption]]]]|caption=First caption}}').infobox().image()
  t.equal(image.caption(), 'Embedded Caption', 'does not inherit the first caption')
  t.equal(image.links()[0].page(), 'Caption', 'retains embedded links')
  t.end()
})
