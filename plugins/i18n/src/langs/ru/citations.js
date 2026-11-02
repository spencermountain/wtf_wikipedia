// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

const citeBook = translate('cite book', {
  'год': 'year',
  'автор': 'author',
  'ответственный': 'editor',
  'editor1': 'editor',
  'часть': 'chapter',
  'заглавие': 'title',
  'ссылка': 'url',
  'издание': 'edition',
  'место': 'location',
  'издательство': 'publisher',
  'id': 'isbn',
  'lang': 'language',
})
const citeJournal = translate('cite journal', {
  'год': 'year',
  'lang': 'language',
})
const citeWeb = translate('cite web', {
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
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
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})

const citations = {
  'cita libro': citeBook,
  'cita publicación': citeJournal,
  'cita web': citeWeb,
  'cite mag': citeJournal,
  'cite magazine': citeJournal,
  'cite paper': citeJournal,
  'cite periodical': citeJournal,
  'cite work': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'cytuj książkę': citeBook,
  'internetquelle': internetquelle,
  'веб-сайт': citeWeb,
}

export default citations
