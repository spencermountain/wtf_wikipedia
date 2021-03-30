module.exports = {
  name: 'City',
  //
  children: {},
  //
  categories: {
    mapping: [],
    patterns: [
      /^cities and towns in ./,
      /(municipalities|settlements|villages|localities|townships) in ./,
    ],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'swiss town',
      'city japan',
      'municipality br',
      'russian town',
      'south african town 2011',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: [
      'sister cities',
      'neighbourhoods',
      'churches',
      'parks and recreation',
      'public transportation',
    ],
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
