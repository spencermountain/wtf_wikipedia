// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citation = {
  template: 'citation',
  map: {
    'izenburua': 'title',
    'urtea': 'year',
    'abizena': 'last',
    'author1-last': 'last',
    'author-last': 'last',
    'surname1': 'last',
    'author-last1': 'last',
    'subject1': 'last',
    'surname': 'last',
    'subject': 'last',
    'abizena1': 'last1',
    'egilea1': 'author1',
    'egilea': 'author',
    'izena1': 'first1',
    'izena': 'first',
    'data': 'date',
    'kazeta': 'journal',
    'aldizkakoa': 'journal',
    'egunkaria': 'newspaper',
    'aldizkaria': 'journal',
    'lana': 'work',
    'liburukia': 'volume',
    'alea': 'issue',
    'orrialdeak': 'pages',
    'orrialdea': 'page',
    'atala': 'chapter',
    'edizioa': 'edition',
    'argitaratze-lekua': 'location',
    'argitaletxea': 'publisher',
  },
}

const citations = {
  'albiste erref': citation,
  'cite news': citation,
  'erreferentzia': citation,
  'liburu erref': citation,
  'txikipedia-erreferentzia': citation,
  'web erref': citation,
}

export default citations
