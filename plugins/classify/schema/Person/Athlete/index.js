module.exports = {
  id: 'Athlete',
  //
  properties: {
    leagues: () => {},
  },
  children: {
    AmericanFootballPlayer: require('./AmericanFootballPlayer'),
    BaseballPlayer: require('./BaseballPlayer'),
    FootballPlayer: require('./FootballPlayer'),
    BasketballPlayer: require('./BasketballPlayer'),
    HockeyPlayer: require('./HockeyPlayer'),
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
