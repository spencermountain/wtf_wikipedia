// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb = {
  template: 'cite web',
  map: {
    'datepublished': 'date',
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
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
    'datepublished': 'date',
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
}

const citations = {
  'cita web': citeWeb,
  'cite web 2': citeWeb,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'internetquelle': internetquelle,
}

export default citations
