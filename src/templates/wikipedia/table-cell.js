//random misc for inline wikipedia templates
const pipeSplit = require('../_parsers/pipeSplit');

const titlecase = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

//https://en.wikipedia.org/wiki/Template:Yes
let templates = {};
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
  'yes2',
  'ya',
  'won',
  'no2',
  'na',
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
];

cells.forEach((str) => {
  templates[str] = (tmpl) => {
    let data = pipeSplit(tmpl, ['text']);
    return data.text || titlecase(data.template);
  };
});

let moreCells = [
  ['active fire', 'Active'],
  ['site active', 'Active'],
  ['site inactive', 'Inactive'],
  ['yes2', ''],
  ['no2', ''],
  ['ya', '✅'],
  ['na', '❌'],
  ['nom', 'Nominated'],
  ['sho', 'Shortlisted'],
  ['tba', 'TBA'],
  ['maybecheck', '✔️'],
  ['okay', 'Neutral'],
  ['n/a', 'N/A'],
  ['sdash', '—'],
  ['dunno', '?'],
  ['draw', ''],
  ['cnone', ''],
  ['nocontest', ''],
];
moreCells.forEach((a) => {
  templates[a[0]] = (tmpl) => {
    let data = pipeSplit(tmpl, ['text']);
    return data.text || a[1];
  };
});

//this one's a little different
templates.won = (tmpl) => {
  let data = pipeSplit(tmpl, ['text']);
  return data.place || data.text || titlecase(data.template);
};

module.exports = templates;
