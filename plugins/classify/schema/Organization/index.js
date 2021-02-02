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
    mapping: [
      'japanese brands',
      'american jazz composers',
      'scouting in the united states',
      'car brands',
      'government-owned airlines',
      'baptist denominations in north america',
      'baptist denominations established in the 20th century',
      'land-grant universities and colleges',
      'organizations based in washington, d.c.',
      'video game publishers',
      'defunct motor vehicle manufacturers of the united states',
      'alternative rock groups from california',
    ],
    patterns: [
      /(organi[sz]ations|publications) based in /,
      /(organi[sz]ations|publications|schools|awards) established in [0-9]{4}/,
      /(secondary|primary) schools/,
      /military units/,
      /magazines/,
      /organi[sz]ation stubs$/,
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
