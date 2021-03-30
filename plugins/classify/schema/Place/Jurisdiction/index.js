module.exports = {
  name: 'Jurisdiction',
  children: {
    City: require('./City'),
    Country: require('./Country'),
  },
  properties: {
    population: () => {},
    leader: () => {},
  },
  //
  categories: {
    mapping: [],
    patterns: [],
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
