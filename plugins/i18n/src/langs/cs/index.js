// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// czech template names → the core template they resolve to
const aliases = {
  'cite magazine': 'cite journal',
  'cite techreport': 'cite journal',
  'commonscat': 'commons cat',
  'datum narození a věk': 'birth date and age',
  'malé': 'small',
  'narození': 'birth date and age',
  'portály': 'portal',
  'references scrollable': 'reflist',
  'souřadnice': 'coord',
  'vlajka': 'flagicon',
}

// names recognised as infoboxes
const infoboxes = [
  'taxonbox',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'příjmení': 'last',
  'jméno': 'first',
  'autor': 'author',
  'titul': 'title',
  'vydavatel': 'publisher',
  'datum vydání': 'date',
  'datum_vydání': 'date',
})
const citeBook = translate('cite book', {
  'příjmení': 'last1',
  'příjmení1': 'last1',
  'jméno': 'first1',
  'jméno1': 'first1',
  'autor': 'author',
  'autor1': 'author',
  'titul': 'title',
  'vydání': 'edition',
  'vydavatel': 'publisher',
  'rok vydání': 'year',
  'rok': 'year',
})

const parsers = {
  'citace databáze': citeWeb,
  'citace elektronické monografie': citeWeb,
  'citace elektronického zdroje': citeWeb,
  'citace knihy': citeBook,
  'citace monografie': citeBook,
  'citace webu': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'cs'
plugin.version = version

export { data }
export default plugin
