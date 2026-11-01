// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// russian template names → the core template they resolve to
const aliases = {
  'bandiera': 'flagicon',
  'catmain': 'main',
  'cc': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord-simple': 'coord',
  'coord/display': 'coord',
  'coord/link': 'coord',
  'coord/linkprint': 'coord',
  'coord/печать': 'coord',
  'fbaicon': 'flagicon',
  'flag icon': 'flagicon',
  'harvnp': 'sfn',
  'ipa1': 'ipa',
  'location': 'coord',
  'main articles': 'main',
  'mainarticle': 'main',
  'maincat': 'main',
  'odn': 'sfn',
  'portail': 'portal',
  'portal-inline': 'portal',
  'portale': 'portal',
  'portalpar': 'portal',
  'see main': 'main',
  'sfb': 'sfn',
  'sfn-1': 'sfn',
  'sfnb': 'sfn',
  'sfnp': 'sfn',
  'викисклад-кат': 'commons cat',
  'главная': 'main',
  'главная статья': 'main',
  'главное': 'main',
  'координаты': 'coord',
  'координаты объекта': 'coord',
  'мфа': 'ipa',
  'нихонго': 'nihongo',
  'общая тема категории': 'main',
  'основная': 'main',
  'основная статья': 'main',
  'основная статья категории': 'main',
  'основная статья по теме категории': 'main',
  'основная статья раздела': 'main',
  'основные статьи': 'main',
  'портал': 'portal',
  'портал 2': 'portal',
  'портал2': 'portal',
  'примечания': 'reflist',
  'родилась': 'birth date and age',
  'родился': 'birth date and age',
  'список примечаний': 'reflist',
  'флаг': 'flagicon',
  'ыат': 'sfn',
}

const infoboxes = []

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'год': 'year',
  'автор': 'author',
  'ответственный': 'editor',
  'editor1': 'editor',
  'часть': 'chapter',
  'заглавие': 'title',
  'ссылка': 'url',
  'издание': 'edition',
  'место': 'location',
  'издательство': 'publisher',
  'id': 'isbn',
  'lang': 'language',
})
const citeJournal = translate('cite journal', {
  'год': 'year',
  'lang': 'language',
})
const citeWeb = translate('cite web', {
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
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
  'datepublished': 'date',
  'lang': 'language',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})

const parsers = {
  'cita libro': citeBook,
  'cita publicación': citeJournal,
  'cita web': citeWeb,
  'cite mag': citeJournal,
  'cite magazine': citeJournal,
  'cite paper': citeJournal,
  'cite periodical': citeJournal,
  'cite work': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'cytuj książkę': citeBook,
  'internetquelle': internetquelle,
  'веб-сайт': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ru'
plugin.version = version

export { data }
export default plugin
