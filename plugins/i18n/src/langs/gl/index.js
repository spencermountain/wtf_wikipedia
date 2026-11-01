// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// galician template names → the core template they resolve to
const aliases = {
  'afi': 'ipa',
  'ap': 'main',
  'artigo principal': 'main',
  'bandeira': 'flag',
  'bandeira2': 'flag',
  'cita publicación': 'cite journal',
  'cita publicación periódica': 'cite journal',
  'cita revista': 'cite journal',
  'cite magazine': 'cite journal',
  'commonscat': 'commons cat',
  'commonscategoría': 'commons cat',
  'coordenadas': 'coord',
  'harvnp': 'sfn',
  'listaref': 'reflist',
  'nota curta': 'sfn',
  'obra citada': 'citation',
  'pequeno': 'small',
  'principal': 'main',
  'referencias': 'reflist',
  'ver artigo principal': 'main',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
  'volumen': 'volume',
  'páxina': 'page',
  'p': 'page',
  'página': 'page',
})
const citeWeb = translate('cite web', {
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
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
  'apelidos-editor': 'editor',
  'apelidos-editor1': 'editor',
})

const parsers = {
  'cita libro': citeBook,
  'cita web': citeWeb,
  'citar libro': citeBook,
  'citar web': citeWeb,
  'citaweb': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'gl'
plugin.version = version

export { data }
export default plugin
