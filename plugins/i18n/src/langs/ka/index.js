// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// georgian template names → the core template they resolve to
const aliases = {
  'cite magazine': 'cite journal',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'flag icon': 'flagicon',
  'ipa-text': 'ipa',
  'დაბადების თარიღი და ასაკი': 'birth date and age',
  'დაიწყე თარიღი': 'start',
  'დეტალები': 'main',
  'დროშა': 'flag',
  'დროშანიშანი': 'flagicon',
  'კოორდ': 'coord',
  'კოორდინატი': 'coord',
  'მთავარი': 'main',
  'მთავარი სტატია': 'main',
  'ნიჰონგი': 'nihongo',
  'ნიჰონგო': 'nihongo',
  'პორტალი': 'portal',
  'სქოლიო': 'reflist',
  'სქოლიოს სია': 'reflist',
  'სქოლიოს სია გრძელი': 'reflist',
}

// names recognised as infoboxes
const infoboxes = [
  'ტაქსოდაფა',
  'ტაქსოდაფა *',
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
  'citeweb': citeWeb,
  'internetquelle': internetquelle,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ka'
plugin.version = version

export { data }
export default plugin
