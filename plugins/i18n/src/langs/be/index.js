// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// belarusian template names → the core template they resolve to
const aliases = {
  'catmain': 'main',
  'catmore': 'main',
  'cite paper': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coord/display': 'coord',
  'initial release': 'start',
  'ipa1': 'ipa',
  'main2': 'main',
  'maincat': 'main',
  'odn': 'sfn',
  'reflist+': 'reflist',
  'refs': 'reflist',
  'sfn-1': 'sfn',
  'sfnp': 'sfn',
  'асноўная': 'main',
  'асноўны': 'main',
  'асноўны артыкул': 'main',
  'асноўны артыкул катэгорыі': 'main',
  'асноўны артыкул па тэме катэгорыі': 'main',
  'асноўныя артыкулы': 'main',
  'болей': 'main',
  'вікісховішча': 'commons cat',
  'вікісховішча-кат': 'commons cat',
  'галоўная': 'main',
  'галоўны артыкул': 'main',
  'галоўны артыкул у катэгорыі': 'main',
  'глядзіце таксама': 'main',
  'дата нараджэння і ўзрост': 'birth date and age',
  'зноска': 'sfn',
  'каардынаты': 'coord',
  'крыніцы': 'reflist',
  'ніханго': 'nihongo',
  'партал': 'portal',
  'скарочаная зноска': 'sfn',
  'сцяг': 'flagicon',
}

// names recognised as infoboxes
const infoboxes = [
  'таксанамія',
]

// templates whose parameter names differ — renamed, then parsed by the core template
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
  'cita web': citeWeb,
  'cite web 2': citeWeb,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'internetquelle': internetquelle,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'be'
plugin.version = version

export { data }
export default plugin
