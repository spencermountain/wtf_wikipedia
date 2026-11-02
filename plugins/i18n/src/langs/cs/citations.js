// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

const citeWeb = translate('cite web', {
  'příjmení': 'last',
  'jméno': 'first',
  'autor': 'author',
  'titul': 'title',
  'vydavatel': 'publisher',
  'datum vydání': 'date',
  'datum_vydání': 'date',
})
const citeBook = translate('cite book', {
  'příjmení': 'last1',
  'příjmení1': 'last1',
  'jméno': 'first1',
  'jméno1': 'first1',
  'autor': 'author',
  'autor1': 'author',
  'titul': 'title',
  'vydání': 'edition',
  'vydavatel': 'publisher',
  'rok vydání': 'year',
  'rok': 'year',
})

const citations = {
  'citace databáze': citeWeb,
  'citace elektronické monografie': citeWeb,
  'citace elektronického zdroje': citeWeb,
  'citace knihy': citeBook,
  'citace monografie': citeBook,
  'citace webu': citeWeb,
}

export default citations
