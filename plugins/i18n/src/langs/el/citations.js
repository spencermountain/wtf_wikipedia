// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

const citeBook = translate('cite book', {
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
})
const citeWeb = translate('cite web', {
  'ημερομηνία': 'date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
})
const internetquelle = translate('cite web', {
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
})

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
