// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
    'surname': 'last',
    'surname1': 'last',
    'author-last': 'last',
    'author-last1': 'last',
    'author1-last': 'last',
    'subject': 'last',
    'subject1': 'last',
    'given': 'first',
    'given1': 'first',
    'author-first': 'first',
    'author-first1': 'first',
    'author1-first': 'first',
    'editor1': 'editor',
    'place': 'location',
    'publication-place': 'location',
    'in': 'language',
    'contribution': 'chapter',
    'accessdate': 'access-date',
    'archivedate': 'archive-date',
    'archiveurl': 'archive-url',
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
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
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}

const citations = {
  'book reference': citeBook,
  'book reference 3': citeBook,
  'c-j': citeJournal,
  'cita web': citeWeb,
  'cite blog': citeWeb,
  'cite book en': citeBook,
  'cite book zh': citeBook,
  'cite book/en': citeBook,
  'cite chapter': citeBook,
  'cite journal en': citeJournal,
  'cite journal zh': citeJournal,
  'cite manual': citeBook,
  'cite paper': citeJournal,
  'cite url': citeWeb,
  'cite web 2': citeWeb,
  'cite web en': citeWeb,
  'cite web ja': citeWeb,
  'cite web site': citeWeb,
  'cite web url': citeWeb,
  'cite web/en': citeWeb,
  'cite web2': citeWeb,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cytuj książkę': citeBook,
  'internetquelle': internetquelle,
  'journal reference': citeJournal,
  'web cite': citeWeb,
  'web reference': citeWeb,
  '引用书籍': citeBook,
  '引用网页': citeWeb,
  '引網': citeWeb,
}

export default citations
