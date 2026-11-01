// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// bulgarian template names → the core template they resolve to
const aliases = {
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'hrf': 'sfn',
  'дата на раждане и години': 'birth date and age',
  'дрг': 'birth date and age',
  'знаме': 'flag',
  'знамеикона': 'flagicon',
  'икона-флаг': 'flagicon',
  'мфа': 'ipa',
  'основна': 'main',
  'портал': 'portal',
}

// names recognised as infoboxes
const infoboxes = [
  'таксокутия',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'уеб_адрес': 'url',
  'заглавие': 'title',
  'автор': 'author',
  'фамилно_име': 'last',
  'първо_име': 'first',
  'труд': 'work',
  'издател': 'publisher',
  'страници': 'pages',
  'цитат': 'quote',
})
const citeBook = translate('cite book', {
  'editor-last': 'editor',
})
const citeJournal = translate('cite journal', {
  'accessdate': 'access-date',
  'достъп_дата': 'access-date',
  'достъп_ден_месец': 'access-date',
  'archiveurl': 'archive-url',
  'архив_уеб_адрес': 'archive-url',
  'archivedate': 'archive-date',
  'архив_дата': 'archive-date',
})

const parsers = {
  'cita web': citeWeb,
  'citeweb': citeWeb,
  'цитат книга': citeBook,
  'цитат периодика': citeJournal,
  'цитат уеб': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'bg'
plugin.version = version

export { data }
export default plugin
