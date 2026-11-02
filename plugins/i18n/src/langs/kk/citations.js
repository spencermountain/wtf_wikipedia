// hand-maintained i18n data — edit freely; 'pnpm run data' diffs it against live wikipedia
// localized citation templates — translate() renames the params, then the core parser runs
import { translate } from '../_lib.js'

const citeJournal = translate('cite journal', {
  'жыл': 'year',
})
const citeWeb = translate('cite web', {
  'archiveurl': 'archive-url',
  'archivedate': 'archive-date',
  'accessdate': 'access-date',
})

const citations = {
  'cite magazine': citeJournal,
  'citeweb': citeWeb,
  'cw': citeWeb,
  'веб сайт': citeWeb,
  'веб-сайт': citeWeb,
}

export default citations
