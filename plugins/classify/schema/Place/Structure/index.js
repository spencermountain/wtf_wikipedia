module.exports = {
  name: 'Structure',
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
    mapping: [
      'airport',
      'bridge',
      'building',
      'power_station',
      'religious_building',
      'stadium',
      'uk school',
      'military structure',
      'religious building',
      'shopping mall',
      'lighthouse',
      'power station',
    ],
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
