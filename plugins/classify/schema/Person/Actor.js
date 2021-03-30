module.exports = {
  id: 'Actor',
  //
  children: {},
  properties: {
    films: () => {},
    tv_shows: () => {},
  },
  //
  categories: {
    mapping: ['male actors from new york city'],
    patterns: [/actresses/, /actors from ./, /actor stubs$/, / (actors|actresses)$/],
  },
  //
  descriptions: {
    patterns: [],
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
    patterns: [],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
