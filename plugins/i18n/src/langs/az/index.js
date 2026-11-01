// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// azerbaijani template names → the core template they resolve to
const aliases = {
  'bayraq': 'flagicon',
  'bayraq-ölkə': 'flagicon',
  'başlama tarixi': 'start',
  'başlanğıc tarixi': 'start',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commons kat': 'commons cat',
  'commons kateqoriyası': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'commonskat': 'commons cat',
  'commonskateqoriyası': 'commons cat',
  'doğum tarixi və yaş': 'birth date and age',
  'doğum tarixi və yaşı': 'birth date and age',
  'dty': 'birth date and age',
  'flaq': 'flagicon',
  'ipa1': 'ipa',
  'i̇sbn': 'isbn',
  'i̇stinad siyahısı': 'reflist',
  'i̇stinadlar': 'reflist',
  'i̇stinadlar siyahısı': 'reflist',
  'kiçik': 'small',
  'nihonqo': 'nihongo',
  'ref list': 'reflist',
  'vikianbar kat': 'commons cat',
  'vikianbar kateqoriyası': 'commons cat',
  'əsas': 'main',
  'əsas məqalə': 'main',
  'əsas səhifə': 'main',
}

// names recognised as infoboxes
const infoboxes = [
  'taksoqutu',
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
  'people': 'authors',
  'host': 'authors',
})

const parsers = {
  'antcat': citeWeb,
  'cite ebd': citeWeb,
  'cite odnb': citeWeb,
  'citeweb': citeWeb,
  'lien web': citeWeb,
  'sayt mənbə': citeWeb,
  'web kaynağı': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'az'
plugin.version = version

export { data }
export default plugin
