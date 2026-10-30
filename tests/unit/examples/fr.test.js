import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Fr', (t) => {
  const doc = wtf(readPage('Radiohead-Fr'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-Fr: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Fr: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'Radiohead-Fr: lead singer link'
  )
  t.ok(doc.section('biographie'), 'Radiohead-Fr: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Fr: sources for the band history')
  t.match(doc.text(), /In Rainbows/, 'Radiohead-Fr: self-released album')
  t.ok(doc.section('formation et début (1986–1991)'), 'Radiohead-Fr: Formation et début (1986–1991) section')
  t.equal(
    doc
      .section('The Bends : reconnaissance par la critique et élargissement du public (1994-1995)')
      .sentences()[0]
      .links()[0]
      .page(),
    '1994 en musique',
    "Radiohead-Fr: 'The Bends : reconnaissance par la critique et élargissement du public (1994-1995)' section, 1st sentence links to '1994 en musique'"
  )
  t.equal(
    doc.sentences()[0].links()[0].text(),
    'groupe',
    "Radiohead-Fr: 1st sentence shows 'groupe' for Groupe musical"
  )
  t.equal(
    doc.sentences()[3].text(),
    'Ce titre devient un succès planétaire à la sortie de leur premier album, Pablo Honey (1993).',
    'Radiohead-Fr: 4th sentence text'
  )
  t.equal(doc.sections()[27].title(), 'Bibliographie', 'Radiohead-Fr: section [27] title')
  t.equal(doc.infobox().get('logo').text(), 'Radiohead wordmark.svg', 'Radiohead-Fr: infobox logo')
  t.equal(
    doc.sentences()[9].links()[0].page(),
    'Hail to the Thief',
    "Radiohead-Fr: 10th sentence links to 'Hail to the Thief'"
  )
  t.ok(
    doc.sentences()[26].text().startsWith("D'après Colin, les membres du groupe ont"),
    "Radiohead-Fr: 27th sentence starts 'D'après Colin, les membres du…'"
  )
  t.equal(doc.lists()[3].lines()[9].text(), 'Peter Hammill', 'Radiohead-Fr: list 4, item 10')
  t.equal(doc.images()[0].file(), 'File:RadioheadO2211125_composite.jpg', 'Radiohead-Fr: 1st image file')
  t.equal(doc.categories()[3], 'Groupe britannique de rock expérimental', 'Radiohead-Fr: 4th category')
  t.equal(
    doc.section('Retrait, best-of et projets solo (2009-2011)').depth(),
    1,
    "Radiohead-Fr: 'Retrait, best-of et projets solo (2009-2011)' is a depth-1 subsection"
  )
  t.end()
})

test('Willow-Fr', (t) => {
  const doc = wtf(readPage('Willow-Fr'))
  t.match(doc.text(), /Salix/, 'Willow-Fr: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salicaceae'),
    'Willow-Fr: botanical link'
  )
  t.ok(doc.section('étymologie'), 'Willow-Fr: botanical section')
  t.ok(doc.images().length > 0, 'Willow-Fr: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-Fr: botanical categories')
  t.ok(doc.section('caractères généraux'), 'Willow-Fr: Caractères généraux section')
  t.ok(doc.section('principales espèces'), 'Willow-Fr: principal willow species section')
  t.equal(doc.sentences()[10].links()[0].page(), 'Étamine', "Willow-Fr: 11th sentence links to 'Étamine'")
  t.equal(
    doc.section('Littérature').sentences()[5].links()[1].text(),
    'déportés',
    "Willow-Fr: 'Littérature' section, 6th sentence shows 'déportés' for Déportation des Acadiens"
  )
  t.equal(
    doc.section('Littérature').sentences()[5].text(),
    "Selon la légende, les saules marquent la présence de villages d'Acadiens déportés.",
    "Willow-Fr: 'Littérature' section, 6th sentence text"
  )
  t.equal(doc.sections()[5].title(), 'Principales espèces', 'Willow-Fr: section [5] title')
  t.equal(doc.sentences()[2].links()[0].page(), 'Arbre', "Willow-Fr: 3rd sentence links to 'Arbre'")
  t.ok(
    doc
      .section('Écologie et distribution')
      .sentences()[7]
      .text()
      .startsWith('Les saules occupent un large éventail de'),
    "Willow-Fr: 'Écologie et distribution' section, 8th sentence starts 'Les saules occupent un large é…'"
  )
  t.equal(doc.lists()[1].lines()[1].text(), 'Salix subg. Chosenia', 'Willow-Fr: list 2, item 2')
  t.equal(
    doc.section('Insectes se nourrissant de saule').sentences()[0].bolds()[0].text,
    'saule',
    "Willow-Fr: 'Insectes se nourrissant de saule' section, 1st sentence bolds 'saule'"
  )
  t.equal(doc.images()[2].file(), 'File:Catkin_at_BBG_(78267).jpg', 'Willow-Fr: 3rd image file')
  t.equal(doc.categories()[0], 'Salicaceae (Cronquist)', 'Willow-Fr: 1st category')
  t.equal(doc.section('Littérature').depth(), 1, "Willow-Fr: 'Littérature' is a depth-1 subsection")
  t.end()
})

test('Wimbledon-Championships-Fr', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Fr'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-Fr: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships-Fr: tennis or venue link'
  )
  t.ok(doc.section('historique'), 'Wimbledon-Championships-Fr: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Fr: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Fr: tournament sources')
  t.ok(
    doc.infoboxes().some((box) => box.get('directeur').text() === 'Sally Bolton'),
    'Wimbledon-Championships-Fr: tournament director in snapshot'
  )
  t.ok(doc.categories().includes('Tournoi de Wimbledon'), 'Wimbledon-Championships-Fr: Tournoi de Wimbledon category')
  t.equal(
    doc.section('Couverture télévisuelle').sentences()[6].links()[2].page(),
    'Tim Henman',
    "Wimbledon-Championships-Fr: 'Couverture télévisuelle' section, 7th sentence links to 'Tim Henman'"
  )
  t.equal(
    doc.section('Ère Sampras').sentences()[7].links()[0].text(),
    'Néerlandais',
    "Wimbledon-Championships-Fr: 'Ère Sampras' section, 8th sentence shows 'Néerlandais' for Pays-Bas"
  )
  t.equal(
    doc.section('Irruption des Français').sentences()[1].text(),
    "La jeune Française devient rapidement l'une des premières stars du tennis féminin mondial.",
    "Wimbledon-Championships-Fr: 'Irruption des Français' section, 2nd sentence text"
  )
  t.equal(doc.sections()[39].title(), 'Trophées', 'Wimbledon-Championships-Fr: section [39] title')
  t.equal(doc.infobox().get('catégorie').text(), 'Grand Chelem', 'Wimbledon-Championships-Fr: infobox catégorie')
  t.equal(
    doc.section('Ère Sampras').sentences()[5].links()[1].page(),
    'Tournoi de Wimbledon 1993',
    "Wimbledon-Championships-Fr: 'Ère Sampras' section, 6th sentence links to 'Tournoi de Wimbledon 1993'"
  )
  t.equal(doc.tables()[1].rows()[0]['col1'], 'Victoire', "Wimbledon-Championships-Fr: table 2, row 1, 'col1' column")
  t.ok(
    doc
      .section('Grand Chelem amateur')
      .sentences()[1]
      .text()
      .startsWith('Toutefois, les dirigeants du tennis se refusent'),
    "Wimbledon-Championships-Fr: 'Grand Chelem amateur' section, 2nd sentence starts 'Toutefois, les dirigeants du t…'"
  )
  t.equal(
    doc.lists()[1].lines()[1].text(),
    'Simple messieurs - Wimbledon Trophy.',
    'Wimbledon-Championships-Fr: list 2, item 2'
  )
  t.equal(doc.images()[4].file(), 'File:Doherty_Brothers.jpg', 'Wimbledon-Championships-Fr: 5th image file')
  t.equal(doc.categories()[1], 'Fondation en 1877', 'Wimbledon-Championships-Fr: 2nd category')
  t.end()
})
