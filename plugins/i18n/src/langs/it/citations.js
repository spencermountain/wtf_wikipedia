// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

const citeBook = translate('cite book', {
  'nome': 'first1',
  'first name': 'first1',
  'nome1': 'first1',
  'cognome': 'last1',
  'last name': 'last1',
  'cognome1': 'last1',
  'titolo': 'title',
  'edizione': 'edition',
  'data': 'date',
  'anno': 'year',
  'editore': 'publisher',
  'lingua': 'language',
  'p': 'page',
  'pagina': 'page',
  'pp': 'pages',
  'pagine': 'pages',
})
const citeJournal = translate('cite journal', {
  'autore': 'author',
  'data': 'date',
  'anno': 'year',
  'titolo': 'title',
  'rivista': 'journal',
  'editore': 'publisher',
  'p': 'page',
  'pp': 'pages',
  'lingua': 'language',
})
const citeWeb = translate('cite web', {
  'autore': 'author',
  'titolo': 'title',
  'p': 'page',
  'data': 'date',
})
const citation = translate('citation', {
  'vol': 'volume',
})

const citations = {
  'cita libro': citeBook,
  'cita periodico': citeJournal,
  'cita pubblicazione': citeJournal,
  'cita rivista': citeJournal,
  'cita sito': citeWeb,
  'cita testo': citation,
  'cita web': citeWeb,
  'cw': citeWeb,
  'lien web': citeWeb,
}

export default citations
