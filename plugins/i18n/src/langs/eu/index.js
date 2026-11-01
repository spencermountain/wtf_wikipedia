// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// basque template names → the core template they resolve to
const aliases = {
  'atari': 'portal',
  'banderaikur': 'flagicon',
  'cite aldizkari': 'cite journal',
  'commonscat': 'commons cat',
  'commonskat': 'commons cat',
  'data': 'start',
  'erref zer': 'reflist',
  'erreferentzia zerrenda': 'reflist',
  'harvnp': 'sfn',
  'jaiotza data eta adina': 'birth date and age',
  'jp': 'nihongo',
  'koord': 'coord',
  'nagusia': 'main',
  'txikipedia-banderaikur': 'flagicon',
  'txikipedia-commonskat': 'commons cat',
  'txikipedia-data': 'start',
  'txikipedia-erreferentzia zerrenda': 'reflist',
}

// names recognised as infoboxes
const infoboxes = [
  'taxotaula',
  'taxotaula automatikoa',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citation = translate('citation', {
  'izenburua': 'title',
  'urtea': 'year',
  'abizena': 'last',
  'author1-last': 'last',
  'author-last': 'last',
  'surname1': 'last',
  'author-last1': 'last',
  'subject1': 'last',
  'surname': 'last',
  'subject': 'last',
  'abizena1': 'last1',
  'egilea1': 'author1',
  'egilea': 'author',
  'izena1': 'first1',
  'izena': 'first',
  'data': 'date',
  'kazeta': 'journal',
  'aldizkakoa': 'journal',
  'egunkaria': 'newspaper',
  'aldizkaria': 'journal',
  'lana': 'work',
  'liburukia': 'volume',
  'alea': 'issue',
  'orrialdeak': 'pages',
  'orrialdea': 'page',
  'atala': 'chapter',
  'edizioa': 'edition',
  'argitaratze-lekua': 'location',
  'argitaletxea': 'publisher',
})

const parsers = {
  'albiste erref': citation,
  'cite news': citation,
  'erreferentzia': citation,
  'liburu erref': citation,
  'txikipedia-erreferentzia': citation,
  'web erref': citation,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'eu'
plugin.version = version

export { data }
export default plugin
