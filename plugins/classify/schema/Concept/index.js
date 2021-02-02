module.exports = {
  id: 'Concept',
  //
  children: {
    MedicalCondition: require('./MedicalCondition'),
    Organism: require('./Organism'),
  },
  properties: {
    creator: () => {},
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
