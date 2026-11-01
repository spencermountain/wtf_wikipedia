// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// polish template names → the core template they resolve to
const aliases = {
  'commonscat': 'commons cat',
  'flaga': 'flagicon',
  'koordynaty': 'coord',
  'lokalizacja': 'coord',
  'odn': 'sfn',
  'osobna strona': 'main',
  'osobny artykuł': 'main',
  'państwo': 'flag',
  'przypisy': 'reflist',
  'współrzędne': 'coord',
}

// names recognised as infoboxes
const infoboxes = [
  'takson infobox',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citation = translate('citation', {
  'autor': 'author',
  'vauthors': 'author',
  'tytuł': 'title',
  'czasopismo': 'journal',
  'periodical': 'journal',
  'data': 'date',
  'data dostępu': 'access-date',
  'rozdział': 'chapter',
  'wydanie': 'issue',
  'wolumin': 'volume',
  'miejsce': 'location',
  'publication-place': 'location',
  'place': 'location',
  'wydawca': 'publisher',
  's': 'pages',
  'praca': 'work',
  'opublikowany': 'website',
  'archiwum': 'archive-url',
  'zarchiwizowano': 'archive-date',
  'cytat': 'quote',
  'język': 'language',
})
const citeJournal = translate('cite journal', {
  'nazwisko': 'last1',
  'imię': 'first1',
  'tytuł': 'title',
  'archiwum': 'archive-url',
  'czasopismo': 'journal',
  'wolumin': 'volume',
  'wydanie': 'issue',
  'strony': 'pages',
  'data': 'date',
  'rok': 'year',
  'wydawca': 'publisher',
  'cytat': 'quote',
  'język': 'language',
})
const citeBook = translate('cite book', {
  'nazwisko': 'last',
  'imię': 'first',
  'tytuł': 'title',
  'wydanie': 'edition',
  'data': 'date',
  'rok': 'year',
  'wydawca': 'publisher',
  'miejsce': 'location',
  'strony': 'pages',
  'rozdział': 'chapter',
  'tytuł tomu': 'volume',
})
const citeWeb = translate('cite web', {
  'tytuł': 'title',
  'nazwisko': 'last',
  'imię': 'first',
  'data': 'date',
  'rok': 'year',
  'data dostępu': 'access-date',
  'opublikowany': 'website',
  'strony': 'pages',
  'język': 'language',
  'lang': 'language',
  'archiwum': 'archive-url',
  'zarchiwizowano': 'archive-date',
  'cytat': 'quote',
})

const parsers = {
  'cytuj': citation,
  'cytuj czasopismo': citeJournal,
  'cytuj książkę': citeBook,
  'cytuj pismo': citeJournal,
  'cytuj stronę': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'pl'
plugin.version = version

export { data }
export default plugin
