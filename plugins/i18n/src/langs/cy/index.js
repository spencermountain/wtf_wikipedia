// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'

// welsh template names → the core template they resolve to
const aliases = {
  'bach': 'small',
  'comincat': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coordinates': 'coord',
  'cyfeiriadau': 'reflist',
  'dyddiad geni ac oedran': 'birth date and age',
  'eicon baner': 'flagicon',
  'eiconbaner': 'flagicon',
  'flag icon': 'flagicon',
  'location': 'coord',
  'prif': 'main',
}

// names recognised as infoboxes
const infoboxes = [
  'blwch tacson',
]

const parsers = {}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'cy'
plugin.version = version

export { data }
export default plugin
