// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// dutch template names → the core template they resolve to
const aliases = {
  'commonscat': 'commons cat',
  'coordinaten': 'coord',
  'coördinaten': 'coord',
  'geboortedatum en leeftijd': 'birth date and age',
  'hoofdartikel': 'main',
  'link portaal': 'portal',
  'references': 'reflist',
  'referenties': 'reflist',
  'refs': 'reflist',
  'vlagland': 'flagicon',
  'zie hoofdartikel': 'main',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'taal': 'language',
  'lang': 'language',
  'voornaam': 'first',
  'achternaam': 'author',
  'auteur': 'author',
  'titel': 'title',
  'uitgever': 'publisher',
  'plaats': 'location',
  'place': 'location',
  'locatie': 'location',
  'datum': 'date',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'citaat': 'quote',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'pagina': 'pages',
  'pagina\'s': 'pages',
  'paginas': 'pages',
  'editie': 'edition',
  'hoofdstuk': 'chapter',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'jaar': 'year',
})
const citeJournal = translate('cite journal', {
  'tijdschrift': 'journal',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'citaat': 'quote',
  'uitgever': 'publisher',
  'datum': 'date',
  'jaar': 'year',
  'taal': 'language',
  'lang': 'language',
  'locatie': 'location',
  'plaats': 'location',
  'titel': 'title',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'achternaam': 'author',
  'auteur': 'author',
  'voornaam': 'first',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'pagina\'s': 'pages',
  'paginas': 'pages',
})
const citeWeb = translate('cite web', {
  'titel': 'title',
  'bezochtdatum': 'access-date',
  'accessdate': 'access-date',
  'datumbezocht': 'access-date',
  'datumgeraadpleegd': 'access-date',
  'raadpleegdatum': 'access-date',
  'achternaam': 'author',
  'voornaam': 'first',
  'datum': 'date',
  'werk': 'website',
  'uitgever': 'publisher',
  'taal': 'language',
  'lang': 'language',
  'archiefurl': 'archive-url',
  'archiveurl': 'archive-url',
  'archief-url': 'archive-url',
  'archiefdatum': 'archive-date',
  'archivedate': 'archive-date',
  'archief-datum': 'archive-date',
  'citaat': 'quote',
  'pagina\'s': 'pages',
  'paginas': 'pages',
  'jaar': 'year',
})

const parsers = {
  'citeer boek': citeBook,
  'citeer journal': citeJournal,
  'citeer web': citeWeb,
  'citeweb': citeWeb,
  'jayden54~nlwiki/voetnoot web': citeWeb,
  'voetnoot web': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'nl'
plugin.version = version

export { data }
export default plugin
