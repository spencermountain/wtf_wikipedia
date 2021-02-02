module.exports = {
  id: 'Event',
  properties: {
    dates: () => {},
    places: () => {},
  },
  children: {
    Disaster: require('./Disaster'),
    Election: require('./Election'),
    MilitaryConflict: require('./MilitaryConflict'),
    SportsEvent: require('./SportsEvent'),
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
