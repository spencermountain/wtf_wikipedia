// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
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
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'autore': 'author',
    'data': 'date',
    'anno': 'year',
    'titolo': 'title',
    'rivista': 'journal',
    'editore': 'publisher',
    'p': 'page',
    'pp': 'pages',
    'lingua': 'language',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'autore': 'author',
    'titolo': 'title',
    'p': 'page',
    'data': 'date',
  },
}
const citation = {
  template: 'citation',
  map: {
    'vol': 'volume',
  },
}

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
