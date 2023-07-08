export default {
  name: 'Actor',
  //
  children: {},
  properties: {
    films: () => { },
    tv_shows: () => { },
  },
  //
  categories: {
    mapping: [],
    patterns: [/(actors|actresses)/i],
  },
  //
  descriptions: {
    patterns: [/(actor|actress)/],
  },
  //
  infoboxes: {
    mapping: ['actor'],
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
    patterns: [/actor-stub$/],
  },
  //
  titles: {
    mapping: ['actor', 'actress'],
    patterns: [],
  },
}
