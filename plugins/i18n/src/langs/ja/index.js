// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// japanese template names → the core template they resolve to
const aliases = {
  'alter': 'birth date and age',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'coord2': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country flagcountry': 'flagicon',
  'country flagicon2': 'flagicon',
  'flag icon': 'flagicon',
  'flag2': 'flag',
  'initial release': 'start',
  'isbn2': 'isbn',
  'location': 'coord',
  'location dec': 'coord',
  'mainarticle': 'main',
  'more': 'main',
  'personendaten': 'persondata',
  'portalbox': 'portal',
  'portalpar': 'portal',
  'refls': 'reflist',
  'refs': 'reflist',
  'sma': 'small',
  'startdate': 'start',
  'wikiportal': 'portal',
  'ウィキポータルリンク': 'portal',
  'ウィキ座標1段度分秒': 'coord',
  'ウィキ座標2段度分秒': 'coord',
  'ウィキ座標世界': 'coord',
  'ウィキ座標度': 'coord',
  'ウィキ座標度分': 'coord',
  'ウィキ座標度分秒': 'coord',
  'コモンズカテゴリ': 'commons cat',
  '位置情報度分秒': 'coord',
  '旗': 'flag',
  '本文': 'main',
  '生年月日と年齢': 'birth date and age',
  '脚注リスト': 'reflist',
  '詳細記事': 'main',
}

// names recognised as infoboxes
const infoboxes = [
  '生物分類表',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeWeb = translate('cite web', {
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
const citeBook = translate('cite book', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editors': 'editor',
  'editor1': 'editor',
  'at': 'page',
  'contribution': 'chapter',
  'number': 'issue',
  'place': 'location',
  'publication-place': 'location',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
const citeJournal = translate('cite journal', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editor1': 'editor',
  'editors': 'editor',
  'number': 'issue',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})
const citation = translate('citation', {
  'surname': 'last',
  'surname1': 'last',
  'given': 'first',
  'given1': 'first',
  'editor1': 'editor',
  'contribution': 'chapter',
  'periodical': 'work',
  'place': 'location',
  'publication-place': 'location',
  'number': 'issue',
  'accessdate': 'access-date',
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
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
})

const parsers = {
  'cite blog': citeWeb,
  'cite book/draft/cite book': citeBook,
  'cite magazine': citeJournal,
  'cite manual': citeBook,
  'cite paper': citeJournal,
  'cite study': citation,
  'cite url': citeWeb,
  'cite web/german': citeWeb,
  'cite web/和書': citeWeb,
  'cite website': citeWeb,
  'cite work': citeBook,
  'cite-web': citeWeb,
  'citebook': citeBook,
  'citejournal': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'internetquelle': internetquelle,
  'ref web': citeWeb,
  'web cite': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ja'
plugin.version = version

export { data }
export default plugin
