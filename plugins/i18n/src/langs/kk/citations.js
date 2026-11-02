// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal = {
  template: 'cite journal',
  map: {
    'жыл': 'year',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'accessdate': 'access-date',
  },
}

const citations = {
  'cite magazine': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'веб сайт': citeWeb,
  'веб-сайт': citeWeb,
}

export default citations
