import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Statoil', (t) => {
  const doc = wtf(readPage('Statoil'))
  t.equal(doc.infobox().type(), 'verksemd', 'Statoil: Nynorsk business infobox')
  t.equal(doc.infobox().get('namn').text(), 'Statoil ASA', 'Statoil: Nynorsk company name field')
  t.equal(doc.infobox().get('selskapsform').text(), 'Allmenaksjeføretak', 'Statoil: company legal form')
  t.match(doc.infobox().get('hovudkontor').text(), /Stavanger/, 'Statoil: headquarters')
  t.ok(
    doc.links().some((link) => link.page() === 'Noreg'),
    'Statoil: Nynorsk country link'
  )

  t.equal(doc.isRedirect(), false, 'Statoil: not-redirect')
  t.equal(doc.infobox().get('namn').text(), 'Statoil ASA', 'Statoil: name')
  t.equal(doc.infobox().type(), 'verksemd', 'Statoil: template')
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'Statoil: cat-length')
  t.equal(doc.images().length, 1, 'Statoil: img-length')
  t.equal(doc.images()[0].file(), 'File:Statoil-Estonia.jpg', 'Statoil: file')
  t.equal(
    doc.images()[0].url(),
    'https://wikipedia.org/wiki/Special:Redirect/file/Statoil-Estonia.jpg',
    'Statoil: image-url'
  )
  t.ok(doc.section('historikk'), 'Statoil: Historikk section')
  t.ok(
    doc.infoboxes().some((box) => box.get('produkt').text() === 'Olje, gass og raffinerte produkt'),
    'Statoil: produkt field'
  )
  t.equal(
    doc.section('Historikk').sentences()[5].links()[2].page(),
    'Bamble kommune',
    "Statoil: 'Historikk' section, 6th sentence links to 'Bamble kommune'"
  )
  t.equal(
    doc.sentences()[2].links()[2].text(),
    'sal av petroleumsprodukt',
    "Statoil: 3rd sentence shows 'sal av petroleumsprodukt' for Nedstraums petroleumsverksemd"
  )
  t.equal(
    doc.sentences()[16].text(),
    'Så tidleg som i 1973 starta selskapet arbeid for å sikra seg petrokjemisk industri.',
    'Statoil: 17th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'Bakgrunnsstoff', 'Statoil: section [2] title')
  t.equal(doc.infobox().get('direktør').text(), 'Helge Lund', 'Statoil: infobox direktør')
  t.equal(doc.sentences()[5].links()[0].page(), 'Helge Lund', "Statoil: 6th sentence links to 'Helge Lund'")
  t.ok(
    doc.sentences()[17].text().startsWith('Etter lobbyverksemd og oppkjøp sat Statoil i'),
    "Statoil: 18th sentence starts 'Etter lobbyverksemd og oppkjøp…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Heimeside', 'Statoil: list 1, item 1')
  t.equal(doc.categories()[0], 'Oljeselskap', 'Statoil: 1st category')
  t.equal(
    doc.images()[0].caption(),
    'Den gamle logoen til Statoil på bensinstasjon i Estland',
    'Statoil: 1st image caption'
  )
  t.equal(doc.sections().length, 4, 'Statoil: 4 sections')
  t.end()
})
