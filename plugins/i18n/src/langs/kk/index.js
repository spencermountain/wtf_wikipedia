// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// kazakh template names → the core template they resolve to
const aliases = {
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor d/new': 'coord',
  'coor/new': 'coord',
  'coord/conversion': 'coord',
  'ipa1': 'ipa',
  'mainarticle': 'main',
  'references': 'reflist',
  'дереккөздер': 'reflist',
  'негізгі мақала': 'main',
  'нихонго': 'nihongo',
  'портал': 'portal',
  'портал 2': 'portal',
  'толық мақала': 'main',
  'ту': 'flagicon',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal = translate('cite journal', {
  'жыл': 'year',
})
const citeWeb = translate('cite web', {
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})

const parsers = {
  'cite magazine': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'веб сайт': citeWeb,
  'веб-сайт': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'kk'
plugin.version = version

export { data }
export default plugin
