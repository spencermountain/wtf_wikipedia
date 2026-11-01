// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// macedonian template names → the core template they resolve to
const aliases = {
  'ap': 'main',
  'commons category': 'commons cat',
  'commons2': 'commons cat',
  'commonscat': 'commons cat',
  'coor at dms': 'coord',
  'coordinates': 'coord',
  'coords': 'coord',
  'country': 'flag',
  'foundation date': 'start',
  'geolinks-us-hoodscale': 'coord',
  'initial release': 'start',
  'portalpar': 'portal',
  'refs': 'reflist',
  'snf': 'sfn',
  'главна': 'main',
  'главна статија': 'main',
  'главно': 'main',
  'дата на раѓање и возраст': 'birth date and age',
  'дата на раѓање и години': 'birth date and age',
  'датум на раѓање и возраст': 'birth date and age',
  'знаме': 'flag',
  'знамеикона': 'flagicon',
  'ифа': 'ipa',
  'мали': 'small',
  'мфа': 'ipa',
  'наведување': 'citation',
  'наводи': 'reflist',
  'нихонго': 'nihongo',
  'портал': 'portal',
  'почетен датум': 'start',
  'почеток-датум': 'start',
  'р-в': 'commons cat',
  'рв': 'commons cat',
  'референци': 'reflist',
  'ризница-врска': 'commons cat',
  'рнв': 'birth date and age',
  'рнив': 'birth date and age',
  'роден на и возраст': 'birth date and age',
  'родена на и возраст': 'birth date and age',
  'цитирање': 'citation',
  'јапонски': 'nihongo',
}

// names recognised as infoboxes
const infoboxes = [
  'таксономија',
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
  'editors': 'editor',
  'trans_title': 'trans-title',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
})
const citeJournal = translate('cite journal', {
  'trans_title': 'trans-title',
  'accessdate': 'access-date',
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
  'air-date': 'date',
  'airdate': 'date',
  'encyclopedia': 'website',
  'encyclopaedia': 'website',
  'dictionary': 'website',
  'mailinglist': 'website',
  'distributor': 'publisher',
  'institution': 'publisher',
  'newsgroup': 'publisher',
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
  'in': 'language',
  'trans_title': 'trans-title',
  'contribution': 'chapter',
  'entry': 'chapter',
  'article': 'chapter',
  'section': 'chapter',
  'quotation': 'quote',
  'accessdate': 'access-date',
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'number': 'issue',
  'people': 'authors',
  'host': 'authors',
  'credits': 'authors',
})

const parsers = {
  'cite website': citeWeb,
  'cite дневник': citeJournal,
  'citebook': citeBook,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'lien web': citeWeb,
  'web cite': citeWeb,
  'книга': citeBook,
  'наведен документ': citeJournal,
  'наведена книга': citeBook,
  'наведена мрежна страница': citeWeb,
  'наведено мрежно место': citeWeb,
  'наведено списание': citeJournal,
  'нмс': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'mk'
plugin.version = version

export { data }
export default plugin
