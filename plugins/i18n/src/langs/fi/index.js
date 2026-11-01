// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// finnish template names → the core template they resolve to
const aliases = {
  'aloituspäivämäärä': 'start',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'coor d': 'coord',
  'japonais': 'nihongo',
  'koordinaatit': 'coord',
  'lippu': 'flag',
  'lippukuva': 'flagicon',
  'muotoilenro': 'formatnum',
  'pääartikkeli': 'main',
  'pääartikkelit': 'main',
  'refs': 'reflist',
  'syntymäaika ja ikä': 'birth date and age',
  'teemasivu': 'portal',
  'viitteet': 'reflist',
}

// names recognised as infoboxes
const infoboxes = [
  'taksonomia',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeJournal = translate('cite journal', {
  'tekijä': 'author',
  'vauthors': 'author',
  'sukunimi': 'last',
  'etunimi': 'first',
  'otsikko': 'title',
  'nimeke': 'title',
  'nimike': 'title',
  'julkaisu': 'journal',
  'ajankohta': 'year',
  'vuosi': 'year',
  'vuosikerta': 'volume',
  'numero': 'issue',
  'sivut': 'pages',
  'julkaisupaikka': 'location',
  'julkaisija': 'publisher',
  'agency': 'publisher',
  'www': 'url',
  'osoite': 'url',
  'arkisto': 'archive-url',
  'archiveurl': 'archive-url',
  'arkistoitu': 'archive-date',
  'archivedate': 'archive-date',
  'kieli': 'language',
})
const citeWeb = translate('cite web', {
  'osoite': 'url',
  'nimeke': 'title',
  'nimike': 'title',
  'otsikko': 'title',
  'julkaisu': 'work',
  'sivusto': 'work',
  'site': 'work',
  'julkaisija': 'publisher',
  'viitattu': 'access-date',
  'luettu': 'access-date',
  'accessdate': 'access-date',
  'tekijä': 'author',
  'ajankohta': 'date',
  'vuosi': 'date',
  'kieli': 'language',
  'lainaus': 'quote',
  'arkisto': 'archive-url',
  'archiveurl': 'archive-url',
  'arkistoitu': 'archive-date',
  'archivedate': 'archive-date',
})
const citeBook = translate('cite book', {
  'tekijä': 'author',
  'vauthors': 'author',
  'sukunimi': 'last',
  'etunimi': 'first',
  'luku': 'chapter',
  'kappale': 'chapter',
  'nimeke': 'title',
  'nimike': 'title',
  'sivut': 'pages',
  'sivu': 'page',
  'julkaisupaikka': 'location',
  'julkaisija': 'publisher',
  'vuosi': 'date',
  'publication-date': 'date',
  'osa': 'volume',
  'painos': 'edition',
  'www': 'url',
  'kieli': 'language',
})

const parsers = {
  'cite magazine': citeJournal,
  'citeweb': citeWeb,
  'kirjaviite': citeBook,
  'lehtiviite': citeJournal,
  'verkkoviite': citeWeb,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'fi'
plugin.version = version

export { data }
export default plugin
