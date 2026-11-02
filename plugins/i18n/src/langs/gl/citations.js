// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
    'apelidos-editor': 'editor',
    'apelidos-editor1': 'editor',
    'volumen': 'volume',
    'páxina': 'page',
    'p': 'page',
    'página': 'page',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'apelidos-editor': 'editor',
    'apelidos-editor1': 'editor',
  },
}
const internetquelle = {
  template: 'cite web',
  map: {
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
    'apelidos-editor': 'editor',
    'apelidos-editor1': 'editor',
  },
}

const citations = {
  'cita libro': citeBook,
  'cita web': citeWeb,
  'citar libro': citeBook,
  'citar web': citeWeb,
  'citaweb': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
}

export default citations
