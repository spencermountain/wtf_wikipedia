module.exports = {
  id: 'Creation',
  children: {
    CreativeWork: require('./CreativeWork'),
    MedicalCondition: require('./MedicalCondition'),
    Organism: require('./Organism'),
    Product: require('./Product'),
  },
  //
  properties: {
    creators: () => {},
    date: () => {},
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
