// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// uzbek template names → the core template they resolve to
const aliases = {
  'asosiy': 'main',
  'asosiy maqola': 'main',
  'bayroq': 'flag',
  'commons category': 'commons cat',
  'commons turkum': 'commons cat',
  'commonscat': 'commons cat',
  'country': 'flag',
  'ipa1': 'ipa',
  'isbn2': 'isbn',
  'koord': 'coord',
  'koordinata': 'coord',
  'manbalar': 'reflist',
  'nixonga': 'nihongo',
  'nixongo': 'nihongo',
  'tavallud sanasi va yoshi': 'birth date and age',
  'tugilgan sanasi va yoshi': 'birth date and age',
  'tugʻilgan sanasi va yoshi': 'birth date and age',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'sarlavha': 'title',
  'arxivurl': 'archive-url',
  'archiveurl': 'archive-url',
  'arxivsana': 'archive-date',
  'archivedate': 'archive-date',
  'muallif': 'author',
  'familiya': 'last',
  'ism': 'first',
  'sana': 'date',
  'yil': 'year',
  'muharrir': 'editor',
  'til': 'language',
  'ish': 'work',
  'sahifalar': 'pages',
  'nashriyot': 'publisher',
  'qaralgan sana': 'access-date',
  'accessdate': 'access-date',
  'iqtibos': 'quote',
})
const citeBook = translate('cite book', {
  'accessdate': 'access-date',
})

const parsers = {
  'citeweb': citeWeb,
  'kitob manbasi': citeBook,
  'veb manbasi': citeWeb,
  'web cite': citeWeb,
  'web manba': citeWeb,
  'web manbasi': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'uz'
plugin.version = version

export { data }
export default plugin
