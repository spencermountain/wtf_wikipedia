// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// norwegian nynorsk template names → the core template they resolve to
const aliases = {
  'cite report': 'citation',
  'citenews': 'citation',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'coor title': 'coord',
  'coor title dm': 'coord',
  'flagg': 'flag',
  'flaggbild': 'flagicon',
  'flaggikon': 'flagicon',
  'fotnoteliste': 'reflist',
  'fødselsdato og alder': 'birth date and age',
  'hovedartikkel': 'main',
  'hovud': 'main',
  'hovudartikkel': 'main',
  'kjelde film': 'citation',
  'kjeldeliste': 'reflist',
  'koor': 'coord',
  'koord': 'coord',
  'koordinatar': 'coord',
  'litaskrift': 'small',
  'litenskrift': 'small',
  'notelist': 'reflist',
  'sf': 'sfn',
  'utdjupande artikkel': 'main',
}

// names recognised as infoboxes
const infoboxes = [
  'prosjekt taksonomi/bruk av taksoboksen',
  'prosjekt taksonomi/lag ein taksoboks',
  'taksoboks',
  'taksoboks2',
  'taksobox',
  'taksonomiboks',
  'taksonomibox',
  'taxoboks',
  'taxonomiboks',
  'taxonomibox',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'tittel': 'title',
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
  'utgivelsesår': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'institution': 'publisher',
  'forlag': 'publisher',
  'editor-last': 'editor',
  'editor-surname': 'editor',
  'editor-last1': 'editor',
  'editor-surname1': 'editor',
  'editor1': 'editor',
  'editor1-last': 'editor',
  'editor1-surname': 'editor',
  'redaktør': 'editor',
  'place': 'location',
  'p': 'page',
  'pp': 'pages',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
})
const citeWeb = translate('cite web', {
  'link': 'url',
  'tittel': 'title',
  'forfattar': 'author',
  'etternamn': 'last',
  'førenamn': 'first',
  'år': 'year',
  'redaktør': 'editor',
  'språk': 'language',
  'verk': 'work',
  'sider': 'pages',
  'utgjevar': 'publisher',
  'vitja': 'access-date',
  'accessdate': 'access-date',
  'besøksdato': 'access-date',
  'sitat': 'quote',
  'nettstad': 'website',
  'nettside': 'website',
  'nettsted': 'website',
})

const parsers = {
  'cite book-en': citeBook,
  'cite book/en': citeBook,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'kjelde av-medium': citeWeb,
  'kjelde www': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'nn'
plugin.version = version

export { data }
export default plugin
