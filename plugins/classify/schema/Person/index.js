module.exports = {
  id: 'Person',
  children: {
    Athlete: require('./Athlete'),
    Actor: require('./Actor'),
    Politician: require('./Politician'),
    Musician: require('./Musician'),
    Author: require('./Author'),
  },
  properties: {
    birth_date: () => {},
    birth_place: () => {},
    nationality: () => {},
    death_date: () => {},
    death_place: () => {},
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
