// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
    'pp': 'pages',
  },
}
const citeJournal = {
  template: 'cite journal',
  map: {
    'pp': 'pages',
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
  'cite chapter': citeBook,
  'cite paper': citeJournal,
  'cite-web': citeWeb,
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
  'web cite': citeWeb,
  'weblap hivatkozás': citeWeb,
}

export default citations
