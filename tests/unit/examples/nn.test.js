import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Statoil', (t) => {
  const doc = wtf(readPage('Statoil'))
  t.equal(doc.infobox().type(), 'verksemd', 'Statoil: Nynorsk business infobox')
  t.equal(doc.infobox().get('namn').text, 'Statoil ASA', 'Statoil: Nynorsk company name field')
  t.equal(doc.infobox().get('selskapsform').text, 'Allmenaksjeføretak', 'Statoil: company legal form')
  t.match(doc.infobox().get('hovudkontor').text, /Stavanger/, 'Statoil: headquarters')
  t.ok(
    doc.links().some((link) => link.page() === 'Noreg'),
    'Statoil: Nynorsk country link'
  )

  t.equal(doc.isRedirect(), false, 'Statoil: not-redirect')
  t.equal(doc.infobox().get('namn').text, 'Statoil ASA', 'Statoil: name')
  t.equal(doc.infobox().type(), 'verksemd', 'Statoil: template')
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'Statoil: cat-length')
  t.equal(doc.images().length, 1, 'Statoil: img-length')
  t.equal(doc.images()[0].file(), 'File:Statoil-Estonia.jpg', 'Statoil: file')
  t.equal(doc.images()[0].url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Statoil-Estonia.jpg', 'Statoil: image-url')
  t.ok(doc.section('Historikk'), 'Statoil: Historikk section')
  t.ok(doc.infoboxes().some((box) => box.get('produkt').text === 'Olje, gass og raffinerte produkt'), 'Statoil: produkt field')
  t.end()
})
