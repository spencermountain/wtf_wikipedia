//random misc for inline wikipedia templates
import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import { titlecase } from '../_lib.ts'

//https://en.wikipedia.org/wiki/Template:Yes
let templates = {}
let cells = [
  'rh',
  'rh2',
  'yes',
  'no',
  'maybe',
  'eliminated',
  'lost',
  'safe',
  'active',
  'site active',
  'coming soon',
  'good',
  'nom',
  'sho',
  'longlisted',
  'tba',
  'success',
  'operational',
  'failure',
  'partial',
  'regional',
  'maybecheck',
  'partial success',
  'partial failure',
  'okay',
  'yes-no',
  'some',
  'nonpartisan',
  'pending',
  'unofficial',
  'unofficial2',
  'usually',
  'rarely',
  'sometimes',
  'any',
  'varies',
  'black',
  'non-album single',
  'unreleased',
  'unknown',
  'perhaps',
  'depends',
  'included',
  'dropped',
  'terminated',
  'beta',
  'table-experimental',
  'free',
  'proprietary',
  'nonfree',
  'needs',
  'nightly',
  'release-candidate',
  'planned',
  'scheduled',
  'incorrect',
  'no result',
  'cmain',
  'calso starring',
  'crecurring',
  'cguest',
  'not yet',
  'optional',
  'bad',
  'always',
  'never',
  'inactive',
  'withdrawn',
  'in progress',
  'on hold',
  'complete',
  'incomplete',
  'nominated',
  'postponed',
  'cancelled',
  'canceled',
  'ongoing',
  'suspended',
  'retired',
  'defunct',
]
cells.forEach((str) => {
  templates[str] = (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: data.text || titlecase(data.template) }
  }
})

//these ones have a text result
let moreCells = [
  ['active fire', 'Active'],
  ['site active', 'Active'],
  ['site inactive', 'Inactive'],
  ['yes2', ''],
  ['no2', ''],
  ['ya', '✅'],
  ['na', '❌'],
  ['nom', 'Nominated'],
  ['table-yes', 'Yes'],
  ['table-no', 'No'],
  ['table-maybe', 'Maybe'],
  ['sho', 'Shortlisted'],
  ['tba', 'TBA'],
  ['tbd', 'TBD'],
  ['maybecheck', '✔️'],
  ['okay', 'Neutral'],
  ['n/a', 'N/A'],
  ['sdash', '—'],
  ['dunno', '?'],
  ['draw', ''],
  ['cnone', ''],
  ['nocontest', ''],
]
moreCells.forEach((a) => {
  templates[a[0]] = (tmpl, parse = defaultParse) => {
    let data = parse(tmpl, ['text'])
    return { data: null, replacement: data.text || a[1] }
  }
})

export default templates
