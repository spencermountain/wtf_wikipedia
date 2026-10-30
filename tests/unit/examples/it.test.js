import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-It', (t) => {
  const doc = wtf(readPage('Radiohead-It'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-It: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-It: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'Radiohead-It: lead singer link'
  )
  t.ok(doc.section('storia'), 'Radiohead-It: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-It: sources for the band history')
  t.ok(doc.categories().includes('Vincitori di Grammy'), 'Radiohead-It: Vincitori di Grammy category')
  t.ok(
    doc.links().some((link) => link.page() === 'Gruppo musicale'),
    'Radiohead-It: gruppo musicale link'
  )
  t.equal(
    doc.sentences()[17].links()[1].page(),
    'Colin Greenwood',
    "Radiohead-It: 18th sentence links to 'Colin Greenwood'"
  )
  t.equal(
    doc.section("1997-1998: OK Computer, l'acclamazione di pubblico e critica").sentences()[0].links()[1].text(),
    'War Child',
    "Radiohead-It: '1997-1998: OK Computer, l'acclamazione di pubblico e critica' section, 1st sentence shows 'War Child' for War Child (beneficenza)"
  )
  t.equal(
    doc.section('1999-2001: Kid A e Amnesiac, la sperimentazione').sentences()[2].text(),
    'Ogni volta che imbracciavo una chitarra, provavo un enorme disgusto».',
    "Radiohead-It: '1999-2001: Kid A e Amnesiac, la sperimentazione' section, 3rd sentence text"
  )
  t.equal(doc.sections()[19].title(), 'Note', 'Radiohead-It: section [19] title')
  t.equal(
    doc.section('2017-2021: il ventennale di OK Computer, Kid A e Amnesiac').sentences()[1].links()[1].page(),
    'Kid A',
    "Radiohead-It: '2017-2021: il ventennale di OK Computer, Kid A e Amnesiac' section, 2nd sentence links to 'Kid A'"
  )
  t.ok(
    doc
      .section('1995-1996: The Bends, il successo in patria')
      .sentences()[1]
      .text()
      .startsWith('La tensione era alta a causa delle'),
    "Radiohead-It: '1995-1996: The Bends, il successo in patria' section, 2nd sentence starts 'La tensione era alta a causa d…'"
  )
  t.equal(
    doc.lists()[1].lines()[3].text(),
    "Ed O'Brien – chitarra, batteria, percussioni, cori (1992–presente)",
    'Radiohead-It: list 2, item 4'
  )
  t.equal(doc.images()[4].file(), 'File:Ed-obrien2006-05Radiohead.jpg', 'Radiohead-It: 5th image file')
  t.equal(doc.section('Album in studio').depth(), 1, "Radiohead-It: 'Album in studio' is a depth-1 subsection")
  t.equal(
    doc.images()[4].caption(),
    "Ed O'Brien contestò all'inizio il cambiamento di sonorità intrapreso con Kid A.",
    'Radiohead-It: 5th image caption'
  )
  t.equal(doc.sections().length, 24, 'Radiohead-It: 24 sections')
  t.end()
})

test('Willow-It', (t) => {
  const doc = wtf(readPage('Willow-It'))
  t.match(doc.text(), /Salix/, 'Willow-It: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salicaceae'),
    'Willow-It: botanical link'
  )
  t.ok(doc.section('etimologia'), 'Willow-It: botanical section')
  t.ok(doc.images().length > 0, 'Willow-It: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-It: botanical categories')
  t.ok(
    doc.links().some((link) => link.page() === 'Linneo'),
    'Willow-It: Linneo link'
  )
  t.ok(doc.section('tassonomia'), 'Willow-It: Tassonomia section')
  t.equal(doc.sentences()[1].links()[2].page(), 'Nord America', "Willow-It: 2nd sentence links to 'Nord America'")
  t.equal(
    doc.sentences()[2].links()[1].text(),
    'radice indoeuropea',
    "Willow-It: 3rd sentence shows 'radice indoeuropea' for Radici del protoindoeuropeo"
  )
  t.equal(
    doc.section('Proprietà medicinali').sentences()[0].text(),
    'Le foglie e la corteccia del salice sono menzionati in antichi testi medici egizi del II millennio a.C. (papiro Ebers, papiro Edwin Smith).',
    "Willow-It: 'Proprietà medicinali' section, 1st sentence text"
  )
  t.equal(doc.sections()[1].title(), 'Etimologia', 'Willow-It: section [1] title')
  t.equal(
    doc.section('Metodi di coltivazione').sentences()[1].links()[2].page(),
    'Margotta',
    "Willow-It: 'Metodi di coltivazione' section, 2nd sentence links to 'Margotta'"
  )
  t.ok(
    doc.sentences()[6].text().startsWith('Le specie spontanee della nostra flora sono'),
    "Willow-It: 7th sentence starts 'Le specie spontanee della nost…'"
  )
  t.equal(doc.lists()[4].lines()[1].text(), 'Pianta ornamentale', 'Willow-It: list 5, item 2')
  t.equal(doc.images()[2].file(), 'File:Willow1.jpg', 'Willow-It: 3rd image file')
  t.equal(doc.categories()[4], 'Taxa classificati da Linneo', 'Willow-It: 5th category')
  t.equal(
    doc.section('Specie presenti in Italia').depth(),
    1,
    "Willow-It: 'Specie presenti in Italia' is a depth-1 subsection"
  )
  t.equal(
    doc.images()[0].caption(),
    'Salici bianchi in inverno - Filicaja - Montaione (FI)',
    'Willow-It: 1st image caption'
  )
  t.end()
})

test('Wimbledon-Championships-It', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-It'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-It: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships-It: tennis or venue link'
  )
  t.ok(doc.section('storia'), 'Wimbledon-Championships-It: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-It: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-It: tournament sources')
  t.ok(
    doc.section('dalle origini alla prima guerra mondiale'),
    'Wimbledon-Championships-It: Dalle origini alla prima guerra mondiale section'
  )
  t.match(doc.text(), /Roger Federer/, 'Wimbledon-Championships-It: singles champion')
  t.equal(
    doc.section('Martina Navratilova alla conquista di Wimbledon').sentences()[0].links()[1].page(),
    'Martina Navrátilová',
    "Wimbledon-Championships-It: 'Martina Navratilova alla conquista di Wimbledon' section, 1st sentence links to 'Martina Navrátilová'"
  )
  t.equal(
    doc.section('La nascita del tennis moderno').sentences()[3].links()[0].text(),
    '1922',
    "Wimbledon-Championships-It: 'La nascita del tennis moderno' section, 4th sentence shows '1922' for Torneo di Wimbledon 1922"
  )
  t.equal(
    doc.section('Dominio americano').sentences()[0].text(),
    "Le prime edizioni del dopoguerra furono segnati dall'instabilità.",
    "Wimbledon-Championships-It: 'Dominio americano' section, 1st sentence text"
  )
  t.equal(doc.sections()[13].title(), "L'era Open", 'Wimbledon-Championships-It: section [13] title')
  t.equal(
    doc.section('La più grande partita mai vista').sentences()[4].links()[0].page(),
    'Tie-break',
    "Wimbledon-Championships-It: 'La più grande partita mai vista' section, 5th sentence links to 'Tie-break'"
  )
  t.equal(
    doc.tables()[0].rows()[11]['periodo'],
    'Prima del 1968:',
    "Wimbledon-Championships-It: table 1, row 12, 'periodo' column"
  )
  t.ok(
    doc
      .section('Dai fratelli Renshaw ai fratelli Doherty')
      .sentences()[7]
      .text()
      .startsWith('Con sette titoli, era il detentore del'),
    "Wimbledon-Championships-It: 'Dai fratelli Renshaw ai fratelli Doherty' section, 8th sentence starts 'Con sette titoli, era il deten…'"
  )
  t.equal(doc.lists()[0].lines()[2].text(), 'Doppio maschile', 'Wimbledon-Championships-It: list 1, item 3')
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Torneo di Wimbledon',
    "Wimbledon-Championships-It: 1st sentence bolds 'Torneo di Wimbledon'"
  )
  t.equal(doc.images()[2].file(), 'File:Doherty_Brothers.jpg', 'Wimbledon-Championships-It: 3rd image file')
  t.equal(doc.categories()[0], 'Torneo di Wimbledon', 'Wimbledon-Championships-It: 1st category')
  t.end()
})
