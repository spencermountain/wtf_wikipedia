// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// german template names → the core template they resolve to
const aliases = {
  'commonscat': 'commons cat',
  'flagge': 'flag',
  'hauptartikel': 'main',
  'hauptseite': 'main',
  'ipa-text': 'ipa',
  'kleinschrift': 'small',
  'koordinate': 'coord',
  'lagewunsch': 'coord',
  'personendaten': 'persondata',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
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
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})
const citeWeb = translate('cite web', {
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})
const literatur = translate('cite book', {
  'titel': 'title',
  'autor': 'author',
  'verlag': 'publisher',
  'jahr': 'year',
  'ort': 'location',
  'seiten': 'pages',
  'sammelwerk': 'journal',
  'band': 'volume',
  'nummer': 'issue',
  'auflage': 'edition',
  'hrsg': 'editor',
  'sprache': 'language',
  'datum': 'date',
  'online': 'url',
})

const parsers = {
  'internetquelle': internetquelle,
  'iq': citeWeb,
  'literatur': literatur,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'de'
plugin.version = version

export { data }
export default plugin
