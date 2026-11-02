// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeWeb = {
  template: 'cite web',
  map: {
    'sarlavha': 'title',
    'arxivurl': 'archive-url',
    'archiveurl': 'archive-url',
    'arxivsana': 'archive-date',
    'archivedate': 'archive-date',
    'muallif': 'author',
    'familiya': 'last',
    'ism': 'first',
    'sana': 'date',
    'yil': 'year',
    'muharrir': 'editor',
    'til': 'language',
    'ish': 'work',
    'sahifalar': 'pages',
    'nashriyot': 'publisher',
    'qaralgan sana': 'access-date',
    'accessdate': 'access-date',
    'iqtibos': 'quote',
  },
}
const citeBook = {
  template: 'cite book',
  map: {
    'accessdate': 'access-date',
  },
}

const citations = {
  'citeweb': citeWeb,
  'kitob manbasi': citeBook,
  'veb manbasi': citeWeb,
  'web cite': citeWeb,
  'web manba': citeWeb,
  'web manbasi': citeWeb,
}

export default citations
