// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// tamil template names → the core template they resolve to
const aliases = {
  'birthdate and age': 'birth date and age',
  'ccat': 'commons cat',
  'cite gazette': 'citation',
  'commoncat': 'commons cat',
  'commons category': 'commons cat',
  'commons+cat': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor d': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'flag icon': 'flagicon',
  'main articles': 'main',
  'mainarticle': 'main',
  'portalpar': 'portal',
  'ref list': 'reflist',
  'refs': 'reflist',
  'seemain': 'main',
  'snf': 'sfn',
  'startdate': 'start',
  'கொடி': 'flag',
  'சான்று': 'reflist',
  'பிறப்பும் அகவையும்': 'birth date and age',
  'புவியியல் அமைவு': 'coord',
  'முதன்மை': 'main',
  'முதன்மைக் கட்டுரை': 'main',
  'மேற்கோள்பட்டியல்': 'reflist',
  'வலைவாசல்': 'portal',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
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
  'institution': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
})
const citeJournal = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})

const parsers = {
  'cite books': citeBook,
  'cite paper': citeJournal,
  'citebook': citeBook,
  'citejournal': citeJournal,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ta'
plugin.version = version

export { data }
export default plugin
