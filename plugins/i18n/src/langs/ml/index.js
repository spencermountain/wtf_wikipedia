// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// malayalam template names → the core template they resolve to
const aliases = {
  'ap': 'main',
  'birthdate and age': 'birth date and age',
  'birthdateandage': 'birth date and age',
  'c cat': 'commons cat',
  'cc': 'commons cat',
  'ccat': 'commons cat',
  'cite paper': 'cite journal',
  'citejournal': 'cite journal',
  'cms-catlist-up': 'commons cat',
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'commonscategory': 'commons cat',
  'coor d': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'date of birth and age': 'birth date and age',
  'flag icon': 'flagicon',
  'geolinks-us-cityscale': 'coord',
  'location': 'coord',
  'mainarticle': 'main',
  'portalpar': 'portal',
  'realist': 'reflist',
  'ref list': 'reflist',
  'reference': 'reflist',
  'refs': 'reflist',
  'snf': 'sfn',
  'അവലംബങ്ങൾ': 'reflist',
  'കവാടം': 'portal',
  'ചെറിയ': 'small',
  'ജന്മദിനം, വയസ്സ്': 'birth date and age',
  'പ്രധാന ലേഖനം': 'main',
  'പ്രധാനലേഖനം': 'main',
  'പ്രലേ': 'main',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
  'editor-last': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
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

const parsers = {
  'cita web': citeWeb,
  'cite blog': citeWeb,
  'cite manual': citeBook,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-book': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'web cite': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ml'
plugin.version = version

export { data }
export default plugin
