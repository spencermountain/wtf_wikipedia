// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

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
    'trans_title': 'trans-title',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'people': 'authors',
    'host': 'authors',
    'credits': 'authors',
  },
}

const citations = {
  'cite mailing list': citeWeb,
  'cite press release': citeWeb,
  'cite url': citeWeb,
  'citeweb': citeWeb,
}

export default citations
