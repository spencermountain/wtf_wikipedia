// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// hebrew template names → the core template they resolve to
const aliases = {
  'cite magazine': 'cite journal',
  'cite paper': 'cite journal',
  'commonscat': 'commons cat',
  'דגל': 'flag',
  'הערות שוליים': 'reflist',
  'הפניה לערך מורחב': 'main',
  'יפא': 'ipa',
  'מסת"ב': 'isbn',
  'סימוכין': 'reflist',
  'ערך מורחב': 'main',
  'ערכים מורחבים': 'main',
  'קישורי פורטל': 'portal',
  'תאריך התחלה': 'start',
}

// names recognised as infoboxes
const infoboxes = [
  'מיון',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
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
  'people': 'authors',
  'host': 'authors',
})

const parsers = {
  'citeweb': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'he'
plugin.version = version

export { data }
export default plugin
