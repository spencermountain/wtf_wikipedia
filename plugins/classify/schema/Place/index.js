module.exports = {
  id: 'Place',
  children: {
    Jurisdiction: require('./Jurisdiction'),
    Structure: require('./Structure'),
    BodyOfWater: require('./BodyOfWater'),
  },
  properties: {
    location: () => {},
    coordinates: () => {},
  },
  //
  categories: {
    mapping: [],
    patterns: [
      /populated places/,
      /landforms of ./,
      /railway stations/,
      /parks in ./,
      / district$/,
      /geography stubs$/,
      /sports venue stubs$/,
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
