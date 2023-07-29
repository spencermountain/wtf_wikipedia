export default {
  name: 'City',
  //
  children: {},
  //
  categories: {
    mapping: [],
    patterns: [
      /^cities and towns in ./,
      /(^former )(municipalities|settlements|villages|localities|townships) in ./,
    ],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'swiss_town',
      'city_japan',
      'municipality_br',
      'russian_town',
      'south_african_town_2011',
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
