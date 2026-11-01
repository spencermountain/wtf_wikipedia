// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// telugu template names → the core template they resolve to
const aliases = {
  'ccat': 'commons cat',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor at d': 'coord',
  'coor at dm': 'coord',
  'coor at dms': 'coord',
  'coor title d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'flag icon': 'flagicon',
  'launch date': 'start',
  'main2': 'main',
  'mainarticle': 'main',
  'refs': 'reflist',
  'release date': 'start',
  'seemain': 'main',
  'shortened footnote template': 'sfn',
  'చిన్న': 'small',
  'పతాకం': 'flag',
  'మూలాల జాబితా': 'reflist',
  'మూలాలజాబితా': 'reflist',
  'మూలాలు': 'reflist',
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
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
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
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
})
const citeWeb = translate('cite web', {
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
  'lang': 'language',
  'people': 'authors',
  'host': 'authors',
})

const parsers = {
  'book reference': citeBook,
  'cite blog': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'web reference': citeWeb,
  'వెబ్ మూలము': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'te'
plugin.version = version

export { data }
export default plugin
