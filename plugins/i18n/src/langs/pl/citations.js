// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citation = {
  template: 'citation',
  map: {
    'autor': 'author',
    'vauthors': 'author',
    'tytuł': 'title',
    'czasopismo': 'journal',
    'periodical': 'journal',
    'data': 'date',
    'data dostępu': 'access-date',
    'rozdział': 'chapter',
    'wydanie': 'issue',
    'wolumin': 'volume',
    'miejsce': 'location',
    'publication-place': 'location',
    'place': 'location',
    'wydawca': 'publisher',
    's': 'pages',
    'praca': 'work',
    'opublikowany': 'website',
    'archiwum': 'archive-url',
    'zarchiwizowano': 'archive-date',
    'cytat': 'quote',
    'język': 'language',
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'nazwisko': 'last1',
    'imię': 'first1',
    'tytuł': 'title',
    'archiwum': 'archive-url',
    'czasopismo': 'journal',
    'wolumin': 'volume',
    'wydanie': 'issue',
    'strony': 'pages',
    'data': 'date',
    'rok': 'year',
    'wydawca': 'publisher',
    'cytat': 'quote',
    'język': 'language',
  },
}
const citeBook = {
  template: 'cite book',
  map: {
    'nazwisko': 'last',
    'imię': 'first',
    'tytuł': 'title',
    'wydanie': 'edition',
    'data': 'date',
    'rok': 'year',
    'wydawca': 'publisher',
    'miejsce': 'location',
    'strony': 'pages',
    'rozdział': 'chapter',
    'tytuł tomu': 'volume',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'tytuł': 'title',
    'nazwisko': 'last',
    'imię': 'first',
    'data': 'date',
    'rok': 'year',
    'data dostępu': 'access-date',
    'opublikowany': 'website',
    'strony': 'pages',
    'język': 'language',
    'lang': 'language',
    'archiwum': 'archive-url',
    'zarchiwizowano': 'archive-date',
    'cytat': 'quote',
  },
}

const citations = {
  'cytuj': citation,
  'cytuj czasopismo': citeJournal,
  'cytuj książkę': citeBook,
  'cytuj pismo': citeJournal,
  'cytuj stronę': citeWeb,
}

export default citations
