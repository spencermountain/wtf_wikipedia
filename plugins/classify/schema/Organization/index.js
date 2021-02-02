module.exports = {
  id: 'Organization',
  //
  children: {
    MusicalGroup: require('./MusicalGroup'),
    Company: require('./Company'),
    SportsTeam: require('./SportsTeam'),
    PoliticalParty: require('./PoliticalParty'),
  },
  properties: {
    leaders: (doc) => {},
    members: (doc) => {},
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
