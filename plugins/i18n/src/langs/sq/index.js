// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// albanian template names → the core template they resolve to
const aliases = {
  'artikulli kryesor': 'main',
  'birth date and age/femër': 'birth date and age',
  'birth date and age/mashkull': 'birth date and age',
  'cito revistë shk': 'cite journal',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coordinates': 'coord',
  'date of birth and age': 'birth date and age',
  'ditëlindja dhe mosha': 'birth date and age',
  'ditëlindja dhe mosha/femër': 'birth date and age',
  'ditëlindja dhe mosha/mashkull': 'birth date and age',
  'dlm': 'birth date and age',
  'dm': 'birth date and age',
  'kryesor': 'main',
  'kryesore': 'main',
  'referencat': 'reflist',
  'referime': 'reflist',
  'sapi': 'ipa',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citation = translate('citation', {
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'periodical': 'website',
  'number': 'issue',
  'place': 'location',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
})
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
  'gjuha': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
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
  'gjuha': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
})

const parsers = {
  'citim': citation,
  'cito uebin': citeWeb,
  'cito web': citeWeb,
  'internetquelle': internetquelle,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'sq'
plugin.version = version

export { data }
export default plugin
