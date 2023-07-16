export default {
  name: 'MilitaryConflict',
  children: {},
  //
  categories: {
    mapping: [
      'wars involving the united kingdom',
      'proxy wars',
      'new zealand wars',
      'battles between england and scotland',
      'conflicts in 1943',
      'last stand battles',
      'battles and conflicts without fatalities',
      'guerrilla wars',
      '20th-century conflicts',
      '20th-century revolutions',
      'sieges involving japan',
      'revolution-based civil wars',
    ],
    patterns: [/conflicts (in|of) [0-9]{4}/, /(wars|battles|conflicts) (involving|of|in) ./],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: ['military_conflict', 'civilian_attack'],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [],
  },
  //
  templates: {
    mapping: [],
    patterns: [],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
