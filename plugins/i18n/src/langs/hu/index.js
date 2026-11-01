// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// hungarian template names → the core template they resolve to
const aliases = {
  'bővebben': 'main',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'fő': 'main',
  'főcikk': 'main',
  'főszócikk': 'main',
  'kategóriaszócikk': 'main',
  'katsz': 'main',
  'koord': 'coord',
  'közvagyonkat': 'commons cat',
  'portál': 'portal',
  'refs': 'reflist',
  'szám': 'formatnum',
  'zászló': 'flag',
  'zászlóikon': 'flagicon',
  'életkor-élő-dátummal': 'birth date and age',
}

// names recognised as infoboxes
const infoboxes = [
  'taxobox szerkesztése',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'pp': 'pages',
})
const citeJournal = translate('cite journal', {
  'pp': 'pages',
})
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
const internetquelle = translate('cite web', {
  'titel': 'title',
  'autor': 'author',
  'werk': 'work',
  'hrsg': 'publisher',
  'datum': 'date',
  'seiten': 'pages',
  'sprache': 'language',
  'abruf': 'access-date',
  'zugriff': 'access-date',
  'archiv-url': 'archive-url',
  'archiv-datum': 'archive-date',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})

const parsers = {
  'cite chapter': citeBook,
  'cite paper': citeJournal,
  'cite-web': citeWeb,
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
  'web cite': citeWeb,
  'weblap hivatkozás': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'hu'
plugin.version = version

export { data }
export default plugin
