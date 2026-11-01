// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// italian template names → the core template they resolve to
const aliases = {
  'bandiera': 'flagicon',
  'calcola età': 'birth date and age',
  'commons cat left': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat left': 'commons cat',
  'piccolo': 'small',
  'portale': 'portal',
  'portali': 'portal',
  'references': 'reflist',
  'release date': 'start',
}

// names recognised as infoboxes
const infoboxes = [
  'tassobox',
]

// templates whose parameter names differ — renamed, then parsed by the core template
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

const parsers = {
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

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'it'
plugin.version = version

export { data }
export default plugin
