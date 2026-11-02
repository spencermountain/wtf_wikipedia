// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

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

const citations = {
  'bok': citeBook,
  'kilde artikkel': citeJournal,
  'kilde bok': citeBook,
  'kilde web': citeWeb,
  'kilde www': citeWeb,
  'tidsskriftsref': citeJournal,
}

export default citations
