// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

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
    'institution': 'publisher',
    'editor-last': 'editor',
    'editor-surname': 'editor',
    'editor-last1': 'editor',
    'editor-surname1': 'editor',
    'editor1': 'editor',
    'editor1-last': 'editor',
    'editor1-surname': 'editor',
    'place': 'location',
    'p': 'page',
    'pp': 'pages',
    'contribution': 'chapter',
    'entry': 'chapter',
    'article': 'chapter',
    'section': 'chapter',
    'quotation': 'quote',
    'number': 'issue',
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'trans_title': 'trans-title',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}

const citations = {
  'cite books': citeBook,
  'cite paper': citeJournal,
  'citebook': citeBook,
  'citejournal': citeJournal,
}

export default citations
