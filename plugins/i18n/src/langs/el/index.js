// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// greek template names → the core template they resolve to
const aliases = {
  'ccat': 'commons cat',
  'cita boe': 'cite journal',
  'cite magazine': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coords': 'coord',
  'country': 'flag',
  'country data': 'flag',
  'ipa link': 'ipa',
  'main page': 'main',
  'petit': 'small',
  'portal box': 'portal',
  'δφα': 'ipa',
  'ηγη': 'birth date and age',
  'ημερομηνία γέννησης και ηλικία': 'birth date and age',
  'ημερομηνία εκκίνησης': 'start',
  'κύριο': 'main',
  'κύριο άρθρο': 'main',
  'κύριο λήμμα': 'main',
  'παραπομπές': 'reflist',
  'πύλη': 'portal',
  'σημειώσεις': 'reflist',
  'στοιχεία προσώπου': 'persondata',
  'σύνδεσμος ipa': 'ipa',
}

// names recognised as infoboxes
const infoboxes = [
  'ταξινομοπλαίσιο',
  'ταξονομοπλαίσιο',
]

// templates whose parameter names differ — renamed, then parsed by the core template
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

const parsers = {
  'cita libro': citeBook,
  'cite manual': citeBook,
  'cite website': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
  'ouvrage': citeBook,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'el'
plugin.version = version

export { data }
export default plugin
