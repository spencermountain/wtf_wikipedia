module.exports = {
  id: 'Structure',
  //
  children: {
    Bridge: require('./Bridge'),
    Airport: require('./Airport'),
  },
  properties: {
    date_created: () => {},
  },
  //
  categories: {
    mapping: [],
    patterns: [
      /(buildings|bridges) completed in /,
      /airports established in ./,
      /(airports|bridges) in ./,
      /buildings and structures in ./,
    ],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [],
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
