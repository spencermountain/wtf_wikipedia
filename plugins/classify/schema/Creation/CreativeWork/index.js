module.exports = {
  id: 'CreativeWork',
  children: {
    Album: require('./Album'),
    Book: require('./Book'),
    Film: require('./Film'),
    TVShow: require('./TVShow'),
    Play: require('./Play'),
    VideoGame: require('./VideoGame'),
  },
  //
  properties: {
    genre: () => {},
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
