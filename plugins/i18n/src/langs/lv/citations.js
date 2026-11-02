// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'author1-last': 'author',
    'author-last': 'author',
    'surname1': 'author',
    'author-last1': 'author',
    'subject1': 'author',
    'surname': 'author',
    'subject': 'author',
    'given': 'first',
    'author-first': 'first',
    'given1': 'first',
    'author-first1': 'first',
    'author1-first': 'first',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
  },
}
const citeBook = {
  template: 'cite book',
  map: {
    'author1-last': 'author',
    'author-last': 'author',
    'surname1': 'author',
    'author-last1': 'author',
    'subject1': 'author',
    'surname': 'author',
    'subject': 'author',
    'given': 'first',
    'author-first': 'first',
    'given1': 'first',
    'author-first1': 'first',
    'author1-first': 'first',
    'distributor': 'publisher',
    'institution': 'publisher',
    'newsgroup': 'publisher',
    'place': 'location',
    'air-date': 'date',
    'airdate': 'date',
    'p': 'page',
    'pp': 'pages',
    'quotation': 'quote',
  },
}

const citations = {
  'cite magazine': citeJournal,
  'cite paper': citeJournal,
  'citeweb': citeWeb,
  'dokumenta atsauce': citeJournal,
  'grāmatas atsauce': citeBook,
  'laikraksta atsauce': citeJournal,
  'publikācijas atsauce': citeJournal,
  'tīmekļa atsauce': citeWeb,
  'tīmekļa vietne': citeWeb,
  'web cite': citeWeb,
  'žurnāla atsauce': citeJournal,
}

export default citations
