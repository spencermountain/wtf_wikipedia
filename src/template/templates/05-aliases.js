const languages = require('../../_data/languages')

//aliases
let aliases = {
  imdb: 'imdb name',
  'imdb episodess': 'imdb episode',
  localday: 'currentday',
  localdayname: 'currentdayname',
  localyear: 'currentyear',
  'birth date based on age at death': 'birth based on age as of date',
  'bare anchored list': 'anchored list',
  cvt: 'convert',
  cricon: 'flagicon',
  sfrac: 'frac',
  sqrt: 'radic',
}

//multiple aliases
let multi = {
  flagcountry: ['cr', 'cr-rt'],

  trunc: ['str left', 'str crop'],

  percentage: ['pct', 'percentage'],

  rnd: ['rndfrac', 'rndnear'],

  abbr: ['tooltip', 'abbrv', 'define'],

  sfn: ['sfnref', 'harvid', 'harvnb'],

  'birth date and age': ['death date and age', 'bda'],

  currentmonth: ['localmonth', 'currentmonthname', 'currentmonthabbrev'],

  currency: ['monnaie', 'unité', 'nombre', 'nb', 'iso4217'],

  coord: ['coor', 'coor title dms', 'coor title dec', 'coor dms', 'coor dm', 'coor dec'],

  'columns-list': ['cmn', 'col-list', 'columnslist', 'collist'],

  nihongo: ['nihongo2', 'nihongo3', 'nihongo-s', 'nihongo foot'],

  plainlist: ['flatlist', 'ublist', 'plain list'],

  'winning percentage': ['winpct', 'winperc'],

  'collapsible list': ['unbulleted list', 'ubl'],

  'election box begin': [
    'election box begin no change',
    'election box begin no party',
    'election box begin no party no change',
    'election box inline begin',
    'election box inline begin no change',
  ],

  'election box candidate': [
    'election box candidate for alliance',
    'election box candidate minor party',
    'election box candidate no party link no change',
    'election box candidate with party link',
    'election box candidate with party link coalition 1918',
    'election box candidate with party link no change',
    'election box inline candidate',
    'election box inline candidate no change',
    'election box inline candidate with party link',
    'election box inline candidate with party link no change',
    'election box inline incumbent',
  ],

  '4teambracket': [
    '2teambracket',
    '4team2elimbracket',
    '8teambracket',
    '16teambracket',
    '32teambracket',
    '4roundbracket-byes',
    'cwsbracket',
    'nhlbracket',
    'nhlbracket-reseed',
    '4teambracket-nhl',
    '4teambracket-ncaa',
    '4teambracket-mma',
    '4teambracket-mlb',
    '16teambracket-two-reseeds',
    '8teambracket-nhl',
    '8teambracket-mlb',
    '8teambracket-ncaa',
    '8teambracket-afc',
    '8teambracket-afl',
    '8teambracket-tennis3',
    '8teambracket-tennis5',
    '16teambracket-nhl',
    '16teambracket-nhl divisional',
    '16teambracket-nhl-reseed',
    '16teambracket-nba',
    '16teambracket-swtc',
    '16teambracket-afc',
    '16teambracket-tennis3',
    '16teambracket-tennis5',
  ],
}

// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
Object.keys(languages).forEach((lang) => {
  aliases['ipa-' + lang] = 'ipa'
  aliases['ipac-' + lang] = 'ipac'
})

// add each alias in
Object.keys(multi).forEach((k) => {
  multi[k].forEach((str) => {
    aliases[str] = k
  })
})

module.exports = aliases
