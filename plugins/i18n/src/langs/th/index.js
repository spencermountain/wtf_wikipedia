// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// thai template names → the core template they resolve to
const aliases = {
  'cc': 'commons cat',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'coords': 'coord',
  'date of birth and age': 'birth date and age',
  'flag icon': 'flagicon',
  'geobox coor': 'coord',
  'lang-jpn': 'nihongo',
  'location dec': 'coord',
  'mainarticle': 'main',
  'nhg': 'nihongo',
  'nhg1': 'nihongo',
  'portal box': 'portal',
  'refist': 'reflist',
  'release date': 'start',
  'snf': 'sfn',
  'คอมมอนส์-หมวดหมู่': 'commons cat',
  'คอมมอนส์หมวดหมู่': 'commons cat',
  'ญป': 'nihongo',
  'ญี่ปุ่น': 'nihongo',
  'ดูบทความหลัก': 'main',
  'ธง': 'flagicon',
  'ธง-ประเทศ': 'flag',
  'บทความหลัก': 'main',
  'บทความหลัก2': 'main',
  'รายการอ้างอิง': 'reflist',
  'สถานีย่อย': 'portal',
  'สถานีย่อย2': 'portal',
  'หมวดหมู่คอมมอนส์': 'commons cat',
  'หลัก': 'main',
  'เล็ก': 'small',
  '生年月日と年齢': 'birth date and age',
}

// names recognised as infoboxes
const infoboxes = [
  'ตารางจำแนกพันธุ์',
  'พฤกษศาสตร์',
  'สัตววิทยา',
  'อนุกรมภิธาน',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
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
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
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
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})

const parsers = {
  'cita web': citeWeb,
  'citar web': citeWeb,
  'cite blog': citeWeb,
  'cite manual': citeBook,
  'cite web/german': citeWeb,
  'cite webpage': citeWeb,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite หนังสือ': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'internetquelle': internetquelle,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'th'
plugin.version = version

export { data }
export default plugin
