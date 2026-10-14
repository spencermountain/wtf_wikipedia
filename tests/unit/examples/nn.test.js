import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Statoil', (t) => {
  const doc = wtf(readPage('Statoil'))
  t.equal(doc.infobox().type(), 'verksemd', 'Nynorsk business infobox')
  t.equal(doc.infobox().get('namn').text(), 'Statoil ASA', 'Nynorsk company name field')
  t.equal(doc.infobox().get('selskapsform').text(), 'Allmenaksjeføretak', 'company legal form')
  t.match(doc.infobox().get('hovudkontor').text(), /Stavanger/, 'headquarters')
  t.ok(
    doc.links().some((link) => link.page() === 'Noreg'),
    'Nynorsk country link'
  )

  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infobox().data.namn.text(), 'Statoil ASA', 'name')
  t.equal(doc.infobox().type(), 'verksemd', 'template')
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'cat-length')
  t.equal(doc.images().length, 1, 'img-length')
  t.equal(doc.image().file(), 'File:Statoil-Estonia.jpg', 'file')
  t.equal(doc.image().url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Statoil-Estonia.jpg', 'image-url')
  t.end()
})
