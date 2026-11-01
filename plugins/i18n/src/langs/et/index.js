// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// estonian template names → the core template they resolve to
const aliases = {
  'algusaeg': 'start',
  'asukoht': 'coord',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonsi kategooria': 'commons cat',
  'commonskat': 'commons cat',
  'geokoordinaadid': 'coord',
  'koord': 'coord',
  'koordinaadid': 'coord',
  'peamine artikkel': 'main',
  'pikemalt': 'main',
  'pikemalt artiklis': 'main',
  'pisilipp': 'flag',
  'portaal': 'portal',
  'riigi ikoon': 'flagicon',
  'riigi lipp': 'flagicon',
  'riigiikoon': 'flagicon',
  'sünniaeg ja vanus': 'birth date and age',
  'süv': 'birth date and age',
  'vaata': 'main',
  'viited': 'reflist',
}

// names recognised as infoboxes
const infoboxes = [
  'taksonitabel',
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
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
})

const parsers = {
  'cite mailing list': citeWeb,
  'cite press release': citeWeb,
  'cite url': citeWeb,
  'citeweb': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'et'
plugin.version = version

export { data }
export default plugin
