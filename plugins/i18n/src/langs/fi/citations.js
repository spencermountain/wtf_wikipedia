// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeJournal = {
  template: 'cite journal',
  map: {
    'tekijä': 'author',
    'vauthors': 'author',
    'sukunimi': 'last',
    'etunimi': 'first',
    'otsikko': 'title',
    'nimeke': 'title',
    'nimike': 'title',
    'julkaisu': 'journal',
    'ajankohta': 'year',
    'vuosi': 'year',
    'vuosikerta': 'volume',
    'numero': 'issue',
    'sivut': 'pages',
    'julkaisupaikka': 'location',
    'julkaisija': 'publisher',
    'agency': 'publisher',
    'www': 'url',
    'osoite': 'url',
    'arkisto': 'archive-url',
    'archiveurl': 'archive-url',
    'arkistoitu': 'archive-date',
    'archivedate': 'archive-date',
    'kieli': 'language',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'osoite': 'url',
    'nimeke': 'title',
    'nimike': 'title',
    'otsikko': 'title',
    'julkaisu': 'work',
    'sivusto': 'work',
    'site': 'work',
    'julkaisija': 'publisher',
    'viitattu': 'access-date',
    'luettu': 'access-date',
    'accessdate': 'access-date',
    'tekijä': 'author',
    'ajankohta': 'date',
    'vuosi': 'date',
    'kieli': 'language',
    'lainaus': 'quote',
    'arkisto': 'archive-url',
    'archiveurl': 'archive-url',
    'arkistoitu': 'archive-date',
    'archivedate': 'archive-date',
  },
}
const citeBook = {
  template: 'cite book',
  map: {
    'tekijä': 'author',
    'vauthors': 'author',
    'sukunimi': 'last',
    'etunimi': 'first',
    'luku': 'chapter',
    'kappale': 'chapter',
    'nimeke': 'title',
    'nimike': 'title',
    'sivut': 'pages',
    'sivu': 'page',
    'julkaisupaikka': 'location',
    'julkaisija': 'publisher',
    'vuosi': 'date',
    'publication-date': 'date',
    'osa': 'volume',
    'painos': 'edition',
    'www': 'url',
    'kieli': 'language',
  },
}

const citations = {
  'cite magazine': citeJournal,
  'citeweb': citeWeb,
  'kirjaviite': citeBook,
  'lehtiviite': citeJournal,
  'verkkoviite': citeWeb,
}

export default citations
