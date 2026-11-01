// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
import register from '../../register.js'
import version from '../../_version.js'
import { translate } from '../_lib.js'

// norwegian template names → the core template they resolve to
const aliases = {
  'catmore': 'main',
  'comcat': 'commons cat',
  'commons category': 'commons cat',
  'commonscat': 'commons cat',
  'commonscat2': 'commons cat',
  'commonskat': 'commons cat',
  'fda': 'birth date and age',
  'flagg': 'flag',
  'flaggikon': 'flagicon',
  'fltest': 'flag',
  'fødselsdato og alder': 'birth date and age',
  'geobox coor': 'coord',
  'hoved': 'main',
  'hovedartikkel': 'main',
  'koord': 'coord',
  'lippukuvake': 'flagicon',
  'mer informasjon': 'main',
  'nærmere informasjon': 'main',
  'referanser': 'reflist',
  'startdato': 'start',
  'utdypende': 'main',
  'utdypende artikkel': 'main',
  'utfyllende': 'main',
  'videre': 'main',
  'videre informasjon': 'main',
}

// names recognised as infoboxes
const infoboxes = [
  'infoboks taksoboks',
  'taksoboks',
  'taksoboks fugl',
  'taksoboks krepsdyr',
  'taksoboks-kunstig-gruppe',
]

// templates whose parameter names differ — renamed, then parsed by the core template
const citeBook = translate('cite book', {
  'lenke': 'url',
  'link': 'url',
  'tittel': 'title',
  'etternavn': 'author',
  'forfatter': 'author',
  'forfatter1': 'author',
  'forfattere': 'author',
  'etternavn1': 'author',
  'fornavn': 'first',
  'fornavn1': 'first',
  'dato': 'date',
  'verk': 'work',
  'utgiver': 'publisher',
  'forlag': 'publisher',
  'redaktør-etternavn': 'editor',
  'redaktør': 'editor',
  'editor1-last': 'editor',
  'editors': 'editor',
  'utgave': 'edition',
  'utgåve': 'edition',
  'bind': 'volume',
  'volum': 'volume',
  'årgang': 'volume',
  'utgivelsessted': 'location',
  'place': 'location',
  'sted': 'location',
  'stad': 'location',
  'side': 'page',
  'språk': 'language',
  'kapittel': 'chapter',
  'artikkel': 'chapter',
  'sitat': 'quote',
})
const citeJournal = translate('cite journal', {
  'sitat': 'quote',
})
const citeWeb = translate('cite web', {
  'link': 'url',
  'tittel': 'title',
  'besøksdato': 'access-date',
  'fornavn': 'first',
  'fornavn1': 'first',
  'etternavn': 'last',
  'etternavn1': 'last',
  'forfatter': 'last',
  'forfatter1': 'last',
  'utgave': 'edition',
  'forlag': 'publisher',
  'utgiver': 'publisher',
  'institusjon': 'publisher',
  'skole': 'publisher',
})

const parsers = {
  'bok': citeBook,
  'kilde artikkel': citeJournal,
  'kilde bok': citeBook,
  'kilde web': citeWeb,
  'kilde www': citeWeb,
  'tidsskriftsref': citeJournal,
}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'no'
plugin.version = version

export { data }
export default plugin
