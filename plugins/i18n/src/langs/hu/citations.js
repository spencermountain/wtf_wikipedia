// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

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

const citations = {
  'cite chapter': citeBook,
  'cite paper': citeJournal,
  'cite-web': citeWeb,
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
  'web cite': citeWeb,
  'weblap hivatkozás': citeWeb,
}

export default citations
