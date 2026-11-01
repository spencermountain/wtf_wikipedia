// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'

// lithuanian template names → the core template they resolve to
const aliases = {
  'bandera': 'flagicon',
  'bandiera': 'flagicon',
  'book': 'cite book',
  'citavimas': 'citation',
  'cite paper': 'cite journal',
  'citeweb': 'cite web',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor at dms': 'coord',
  'coor title d': 'coord',
  'coor title dm': 'coord',
  'fbaicon': 'flagicon',
  'flag icon': 'flagicon',
  'išn': 'reflist',
  'išnašos': 'reflist',
  'mažas': 'small',
  'pagr': 'main',
  'pradžios data': 'start',
  'ref': 'reflist',
  'vikisritis': 'portal',
  'vlv': 'flagicon',
}

const infoboxes = []

const parsers = {}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'lt'
plugin.version = version

export { data }
export default plugin
