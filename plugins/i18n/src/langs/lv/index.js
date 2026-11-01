// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// latvian template names → the core template they resolve to
const aliases = {
  'atsauce': 'citation',
  'atsauces': 'reflist',
  'atsauces2': 'reflist',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'datdv': 'birth date and age',
  'ddv': 'birth date and age',
  'dzim diena un vecums': 'birth date and age',
  'dzimšanas datums un vecums': 'birth date and age',
  'flaga': 'flagicon',
  'galvenais': 'main',
  'ipaslink': 'ipa',
  'karoga ikona': 'flagicon',
  'karogs': 'flag',
  'pamatraksts': 'main',
  'portal2': 'portal',
  'portāls': 'portal',
  'portāls2': 'portal',
  'viited': 'reflist',
  'vikikrātuves kategorija': 'commons cat',
}

// names recognised as infoboxes
const infoboxes = [
  'bioloģiskās taksonomijas infokaste',
  'biotakso',
  'biotakso infokaste',
  'biotaksonomijas infokaste',
  'dzīvnieki infobox',
  'info biotakso',
  'info taxo',
  'taksonomijas infokaste',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
})
const citeBook = translate('cite book', {
  'author1-last': 'author',
  'author-last': 'author',
  'surname1': 'author',
  'author-last1': 'author',
  'subject1': 'author',
  'surname': 'author',
  'subject': 'author',
  'given': 'first',
  'author-first': 'first',
  'given1': 'first',
  'author-first1': 'first',
  'author1-first': 'first',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
  'place': 'location',
  'air-date': 'date',
  'airdate': 'date',
  'p': 'page',
  'pp': 'pages',
  'quotation': 'quote',
})

const parsers = {
  'cite magazine': citeJournal,
  'cite paper': citeJournal,
  'citeweb': citeWeb,
  'dokumenta atsauce': citeJournal,
  'grāmatas atsauce': citeBook,
  'laikraksta atsauce': citeJournal,
  'publikācijas atsauce': citeJournal,
  'tīmekļa atsauce': citeWeb,
  'tīmekļa vietne': citeWeb,
  'web cite': citeWeb,
  'žurnāla atsauce': citeJournal,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'lv'
plugin.version = version

export { data }
export default plugin
