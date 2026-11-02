// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

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

const citations = {
  'cita libro': citeBook,
  'cita web': citeWeb,
  'citar libro': citeBook,
  'citar web': citeWeb,
  'citaweb': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
}

export default citations
