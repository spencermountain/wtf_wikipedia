const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('महात्मा_गांधी', 'hi');
// var doc = await wtf.random();
// console.log(doc.text());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Горбатая_гора', 'ru', function(err, doc) {
//   console.log(doc.sections('Сюжет').sentences().map((s) => s.text()));
// });

let str = `{{Taxobox
  | name = Gökärt
  | status = 
  | image =
  | image_caption = 
  | range_map = 
  | range_map_caption = 
  | image2 = 315 Lathyrus montanus, Lathyrus vernus.jpg
  | image2_caption = 
  <small>Från [[Carl Lindman]]: ''Bilder ur Nordens Flora,'' tavla 315</small>
  <hr>
  '''A.''' ''Gökärt''
  * '''1''' Stjälkens övre hälft
  * '''2''' Blomma, förstoring ×&nbsp;1,5
  * '''3''' [[Balja (botanik)|Balja]]
  * '''4''' Frö, naturlig storlek och förstoring ×&nbsp;4
  * '''5''' Växtanlag
  '''B.''' ''Vårärt''
  * '''6''' Blomma, förstoring ×&nbsp;1,5
  * '''7''' Befruktningsorganen, förstoring ×&nbsp;4
  | domain_sv = [[Eukaryoter]]
  | domain = Eukaryota
  | regnum_sv = [[Växter]]
  | regnum = Plantae
  | divisio_sv = [[Fröväxter]]
  | divisio = Spermatophyta
  | subdivisio_sv = [[Gömfröväxter]]
  | subdivisio = Angiospermae
  | classis_sv = [[Trikolpater]]
  | classis = Eudicotyledonae
  | ordo_sv = [[Ärtordningen]]
  | ordo = Fabales
  | familia_sv = [[Ärtväxter]]
  | familia = Fabaceae
  | genus_sv = [[Vialsläktet]]
  | genus = Lathyrus
  | species_sv = '''Gökärt'''
  | species = L. linifolius
  | taxon = Lathyrus linifolius
  | taxon_authority = ([[Johann Jacob Reichard|
  Reichard]]) [[Manfred Bässler|Bässler]]
  | synonyms = 
  *''Lathyrus linifolius'' var. ''montanus'' ([[Johann Jakob Bernhardi|Bernh.]]) [[Manfred Bässler|Bässler]]
  *''Lathyrus macrorrhizus'' [[Christian Friedrich Heinrich Wimmer|Wimmer]], 1841
  *''Lathyrus macrorrhizus'' proles ''rothii'' [[Georges Rouy|Rouy]], 1899
  *''Lathyrus macrorrhizus'' var. ''divaricatus'' ([[Philippe-Isidore Picot de Lapeyrouse|Lapeyr.]]) [[Georges Rouy|Rouy]], 1899
  *''Lathyrus macrorrhizus'' var. ''pyrenaicus'' ([[Carl von Linné|L.]]) [[Georges Rouy|Rouy]], 1899
  *''Lathyrus montanus'' [[Johann Jakob Bernhardi|Bernh.]], 1800
  *''Lathyrus montanus'' subsp. ''divaricatus'' ([[Philippe-Isidore Picot de Lapeyrouse|Lapeyr.]]) [[Giovanni Arcangeli|Arcang.]], 1882 
  *''Lathyrus montanus'' subsp. ''pyrenaicus'' ([[Carl von Linné|L.]]) [[Giovanni Arcangeli|Arcang.]], 1882
  *''Lathyrus montanus'' subsp. ''tenuifolius'' ([[Albrecht Wilhelm Roth|[Roth]]) [[Giovanni Arcangeli|Arcang.]], 1882
  *''Lathyrus montanus'' var. ''tenuifolius'' ([[Albrecht Wilhelm Roth|Roth]]) [[Christian August Friedrich Garcke|Garcke]], 1848
  *''Orobus alpestris'' [[Joseph Karl(Carl) Maly|Malý]], 1802-1803 [[nom. illeg.]]
  *''Orobus divaricatus'' [[Philippe-Isidore Picot de Lapeyrouse|Lapeyr.]], 1815
  *''Orobus ellipticus'' [[Pál(Paul) Kitaibel|Kit.]]
  *''Orobus graminifolius'' [[Johannes Becker|Becker]], 1827
  *''Orobus linifolius'' [[Johann Jacob (Jakob) Reichard|Reichard]]
  *''Orobus pluckenetii'' [[Philippe-Isidore Picot de Lapeyrouse|Lapeyr.]], 1815
  *''Orobus prostratus'' [[Nicolaus Thomas Host|Host]], 1831
  *''Orobus pyrenaicus'' [[Carl von Linné|L.]], 1753
  *''Orobus tenuifolius'' [[Albrecht Wilhelm Roth|Roth]], 1782
  *''Orobus tuberosus'' [[Carl von Linné|L.]], 1753
  }}`
let doc = wtf(str)
console.log(doc.images())
