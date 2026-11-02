// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb = {
  template: 'cite web',
  map: {
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}
const citeBook = {
  template: 'cite book',
  map: {
    'surname': 'last',
    'surname1': 'last',
    'given': 'first',
    'given1': 'first',
    'editors': 'editor',
    'editor1': 'editor',
    'at': 'page',
    'contribution': 'chapter',
    'number': 'issue',
    'place': 'location',
    'publication-place': 'location',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'surname': 'last',
    'surname1': 'last',
    'given': 'first',
    'given1': 'first',
    'editor1': 'editor',
    'editors': 'editor',
    'number': 'issue',
    'accessdate': 'access-date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
  },
}
const citation = {
  template: 'citation',
  map: {
    'surname': 'last',
    'surname1': 'last',
    'given': 'first',
    'given1': 'first',
    'editor1': 'editor',
    'contribution': 'chapter',
    'periodical': 'work',
    'place': 'location',
    'publication-place': 'location',
    'number': 'issue',
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
  'cite blog': citeWeb,
  'cite book/draft/cite book': citeBook,
  'cite magazine': citeJournal,
  'cite manual': citeBook,
  'cite paper': citeJournal,
  'cite study': citation,
  'cite url': citeWeb,
  'cite web/german': citeWeb,
  'cite web/和書': citeWeb,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'internetquelle': internetquelle,
  'ref web': citeWeb,
  'web cite': citeWeb,
}

export default citations
