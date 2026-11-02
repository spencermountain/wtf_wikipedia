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
  },
}

const citations = {
  'cita publicación': citeJournal,
  'citation journal': citeJournal,
  'cite magazine article': citeJournal,
  'cite paper': citeJournal,
  'citejournal': citeJournal,
  'citepaper': citeJournal,
  'internetquelle': internetquelle,
}

export default citations
