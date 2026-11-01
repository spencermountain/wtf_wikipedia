// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'

// slovak template names → the core template they resolve to
const aliases = {
  'citácia elektronického dokumentu': 'cite web',
  'citácia harvard': 'citation',
  'citácia knihy': 'cite book',
  'citácia periodika': 'cite journal',
  'commonscat': 'commons cat',
  'dnv': 'birth date and age',
  'dátum narodenia a vek': 'birth date and age',
  'hlavný článok': 'main',
  'malé': 'small',
  'minivlajka': 'flagicon',
  'portál': 'portal',
  'referencie': 'reflist',
  'súradnice': 'coord',
}

const infoboxes = []

const parsers = {}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'sk'
plugin.version = version

export { data }
export default plugin
