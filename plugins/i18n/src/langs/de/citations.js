// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

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
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'lang': 'language',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
}
const literatur = {
  template: 'cite book',
  map: {
    'titel': 'title',
    'autor': 'author',
    'verlag': 'publisher',
    'jahr': 'year',
    'ort': 'location',
    'seiten': 'pages',
    'sammelwerk': 'journal',
    'band': 'volume',
    'nummer': 'issue',
    'auflage': 'edition',
    'hrsg': 'editor',
    'sprache': 'language',
    'datum': 'date',
    'online': 'url',
  },
}

const citations = {
  'internetquelle': internetquelle,
  'iq': citeWeb,
  'literatur': literatur,
}

export default citations
