// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — the map renames params, then the core template parses

const citeBook = {
  template: 'cite book',
  map: {
    'τίτλος': 'title',
    'επώνυμο': 'author',
    'συγγραφέας': 'author',
    'επώνυμο1': 'author',
    'συγγραφέας1': 'author',
    'όνομα': 'first',
    'όνομα1': 'first',
    'ημερομηνία': 'date',
    'εκδότης': 'publisher',
    'έτος': 'year',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
    'επώνυμο-επιμελητή': 'editor',
    'επώνυμο-επιμελητή1': 'editor',
    'επιμελητής': 'editor',
    'έκδοση': 'edition',
    'τόμος': 'volume',
    'place': 'location',
    'p': 'page',
    'σελίδα': 'page',
    'σ': 'page',
    'pp': 'pages',
    'σελίδες': 'pages',
    'σσ': 'pages',
    'κεφάλαιο': 'chapter',
    'μεταφρασμένος-τίτλος': 'trans-title',
    'γλώσσα': 'language',
    'in': 'language',
  },
}
const citeWeb = {
  template: 'cite web',
  map: {
    'ημερομηνία': 'date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
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
    'ημερομηνία': 'date',
    'archiveurl': 'archive-url',
    'archivedate': 'archive-date',
    'editor-last': 'editor',
    'editor1-last': 'editor',
    'editors': 'editor',
  },
}

const citations = {
  'cita libro': citeBook,
  'cite manual': citeBook,
  'cite website': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
  'ouvrage': citeBook,
}

export default citations
