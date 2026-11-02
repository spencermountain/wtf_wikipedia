// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

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

const citations = {
  'cita web': citeWeb,
  'citeweb': citeWeb,
  'цитат книга': citeBook,
  'цитат периодика': citeJournal,
  'цитат уеб': citeWeb,
}

export default citations
