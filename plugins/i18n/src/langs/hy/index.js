// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// armenian template names → the core template they resolve to
const aliases = {
  'coord-nocat': 'coord',
  'cytuj pismo': 'cite journal',
  'ipa1': 'ipa',
  'portal bar': 'portal',
  'refs': 'reflist',
  'примечания': 'reflist',
  'աղբյուր': 'reflist',
  'աղբյուրներ': 'reflist',
  'գլխավորը': 'main',
  'դրոշ': 'flag',
  'ծանոթագրություններ': 'reflist',
  'ծանցանկ': 'reflist',
  'ծատ': 'birth date and age',
  'ծննդյան ամսաթիվ և տարիք': 'birth date and age',
  'կոորդ': 'coord',
  'կոորդինատներ': 'coord',
  'հիմնական': 'main',
  'հիմնական հոդված': 'main',
  'հիմնական հոդված2': 'main',
  'նիհոնգո': 'nihongo',
  'պորտալ': 'portal',
  'փոքր': 'small',
}

// names recognised as infoboxes
const infoboxes = [
  'տաքսոտուփ',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
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
  'accessdate': 'access-date',
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
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})

const parsers = {
  'cita web': citeWeb,
  'citar web': citeWeb,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'cytuj książkę': citeBook,
  'cytuj stronę': citeWeb,
  'internetquelle': internetquelle,
  'lien web': citeWeb,
  'ouvrage': citeBook,
  '웹 인용': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'hy'
plugin.version = version

export { data }
export default plugin
