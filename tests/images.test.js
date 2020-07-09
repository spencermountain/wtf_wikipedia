var test = require('tape')
var wtf = require('./lib')
var readFile = require('./lib/_cachedPage')

test('gallery-tag', (t) => {
  var str = `
hey cool!
==Paintings==
While his early works were often brilliant, luminous [[watercolor]]s, by 1887 he had switched firmly to oils. Zorn was a prolific artist. He became an international success as one of the most acclaimed portrait painters of his era. His sitters included three American Presidents, nobility, the Swedish king and queen and numerous members of high society. Zorn also painted portraits of family members, friends, and self-portraits. Zorn is also famous for his nude paintings.<ref name="safran-arts.com"/> His fondness of painting full-figured women gave rise to the terms Zorn's ''kulla'' or ''dalakulla'', an unmarried woman or girl from [[Dalecarlia]], as the women were called in the local [[dialect]] of the region Zorn lived.

<gallery widths="200px" heights="200px" caption="Nudes">
File:Freya (1901) by Anders Zorn.jpg|''[[Freyja|Freya]]'', 1901
File:ZORN på sandhamn.jpg|Woman bathing at Sandhamn, 1906
File:Anders Zorn I werners eka-1917.jpg|Woman in a boat, 1917
File:Anders Zorn - I Sängkammaren.jpg|''In the bedroom'', 1918
File:Anders Zorn - Ateljéidyll.jpg|G''Studio Idyll'', 1918
</gallery>

The paintings have the freedom and energy of  sketches, using warm and cool light and shade areas<ref name="safran-arts.com"/> with contrasting areas of warm and cool tones, and an understanding of colour contrasts and reflected lights. Zorn's accomplished use of the brush allows the forms and the texture of the painted subject to reflect and transmit light. In addition to portraits and nudes, Zorn excelled in realistic depictions of water, as well as scenes depicting rustic life and customs.
  `
  var doc = wtf(str)
  t.deepEqual(doc.sections('paintings').templates('gallery').length, 1, 'section-has-gallery')
  var templ = doc.templates(0)
  t.deepEqual(templ.template, 'gallery', 'document-has-template')
  t.deepEqual(templ.images.length, 5, '5 images')
  t.deepEqual(templ.images[0].caption.links(0).page(), 'Freyja', 'image has caption')
  t.deepEqual(doc.images().length, 5, 'images() finds gallery')
  t.end()
})

test('gallery-tag-2', (t) => {
  var doc = wtf(`hello

  <gallery>
   Culex-female.jpg|Stechmücke
   Black Fly.png|Kriebelmücke
   Culicoides-imicola-bloodfeeding.jpg|Gnitzen
   Tipula oleracea female (Linnaeus 1758).jpg|Schnake
   Chironomus plumosus01.jpg|Zuckmücke
   Psychodidae.jpg|Schmetterlingsmücke
   Fly February 2009-2.jpg|Haarmücke
   Sciara_analis_de.jpg|Trauermücke
  </gallery>

  foo`)
  var templ = doc.templates(0)
  t.deepEqual(templ.template, 'gallery', 'document-has-template')
  t.deepEqual(templ.images.length, 8, '8 images')
  t.deepEqual(templ.images[0].file, 'Culex-female.jpg', 'got filename')
  t.end()
})

test('gallery-template', (t) => {
  var str = `{{Gallery|width=200 |lines=4
|File:India1909PrevailingRaces.JPG|The map of the prevailing "races" of India (now discredited) based on the 1901 Census of British India. The Kurmi are shown both in the [[United Provinces of Agra and Oudh|United Provinces]] (UP) and the [[Central Provinces]].
|File:Kurmi sowing.jpg|An "ethnographic" photograph from 1916 showing Kurmi farmers, both men and women, sowing a field.
|File:Kurmi threshing.jpg|Another ethnographic print from 1916 showing a Kurmi family employing its beasts of burden to thresh wheat.
|File:Kurmi winnowing.jpg|A third print from the same collection showing the Kurmi family winnowing.
}} `
  var templ = wtf(str).templates(0)
  t.deepEqual(templ.template, 'gallery', 'document-has-template')
  t.deepEqual(templ.images.length, 4, 'has 4 images')
  t.end()
})

test('from-infobox', (t) => {
  let doc = readFile('jodie_emery')
  t.equal(
    doc.infobox(0).images(0).thumb(),
    'https://wikipedia.org/wiki/Special:Redirect/file/Marc_Emery_and_Jodie_Emery.JPG?width=300',
    'has correct thumbnail'
  )
  t.end()
})

test('img-alt', (t) => {
  let str = `[[File:Wikipedesketch1.png|thumb|alt=A cartoon centipede detailed description.|The Wikipede edits ''[[Myriapoda]]''.]]`
  let img = wtf(str).images(0).json()
  t.equal(img.file, 'File:Wikipedesketch1.png', 'file')
  t.equal(img.thumb, 'https://wikipedia.org/wiki/Special:Redirect/file/Wikipedesketch1.png?width=300', 'thumb')
  t.equal(img.url, 'https://wikipedia.org/wiki/Special:Redirect/file/Wikipedesketch1.png', 'image')
  t.equal(img.caption, 'The Wikipede edits Myriapoda.', 'caption')
  t.equal(img.alt, 'A cartoon centipede detailed description.', 'alt')
  // t.equal(img.links[0].page, 'Myriapoda', 'links'); //todo: support links in captions again!
  t.end()
})

test('parsed-captions', (t) => {
  let str = `[[File:Volkswagen W12.jpg|thumb|upright|[[Volkswagen Group]] W12 engine from the [[Volkswagen Phaeton|Volkswagen Phaeton W12]]]]`
  let img = wtf(str).images(0).json()
  t.equal(img.caption, 'Volkswagen Group W12 engine from the Volkswagen Phaeton W12', 'caption')
  t.end()
})
