// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// serbo-croatian template names → the core template they resolve to
const aliases = {
  'category commons': 'commons cat',
  'cite journal2': 'cite journal',
  'citiranje časopisa': 'cite journal',
  'commons category': 'commons cat',
  'commons category-lat': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat-lat': 'commons cat',
  'commonscategory': 'commons cat',
  'datum rođenja i godine': 'birth date and age',
  'flag icon': 'flagicon',
  'glavni': 'main',
  'glavni članak': 'main',
  'glavni-lat': 'main',
  'ikonazastave': 'flagicon',
  'izvori': 'reflist',
  'kategorija na ostavi': 'commons cat',
  'main article-lat': 'main',
  'main-lat': 'main',
  'mainarticle': 'main',
  'malo': 'small',
  'mfa': 'ipa',
  'ostava': 'commons cat',
  'portal-lat': 'portal',
  'poseban članak': 'main',
  'ref-list': 'reflist',
  'reference': 'reflist',
  'reflista': 'reflist',
  'refs': 'reflist',
  'refspisak': 'reflist',
  'spisref': 'reflist',
  'spremnik': 'commons cat',
  'startdate': 'start',
  'zas': 'flagicon',
  'zastava': 'flag',
  'zd': 'flagicon',
  'zid': 'flag',
  'зд': 'flagicon',
  'извори': 'reflist',
  'ипа': 'ipa',
  'координате': 'coord',
  'маин': 'main',
  'мфа': 'ipa',
  'рефлист': 'reflist',
}

// names recognised as infoboxes
const infoboxes = [
  'infokutija takson',
  'infokutija taksonomija',
  'infokvir takson',
  'infokvir taksonomija',
  'infookvir takson',
  'infookvir taksonomija',
  'taksokvir',
  'taksonomska infokutija',
  'taksonomska kutija',
  'taksonomski infokvir',
  'taksonomski infookvir',
  'taksonomski okvir',
  'taxobox-lat',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'author-last': 'author',
  'surname': 'author',
  'subject': 'author',
  'author1-last': 'author',
  'author-last1': 'author',
  'surname1': 'author',
  'subject1': 'author',
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

const parsers = {
  'book reference': citeBook,
  'cite web-lat': citeWeb,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'citiranje knjige': citeBook,
  'citiranje weba': citeWeb,
  'knjiga': citeBook,
  'knjiga (sr)': citeBook,
  'web cite': citeWeb,
  'web reference': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'sh'
plugin.version = version

export { data }
export default plugin
