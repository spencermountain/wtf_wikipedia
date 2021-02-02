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
    mapping: [
      'operas',
      'american science fiction novels',
      'broadway musicals',
      'debut novels',
      'the twilight zone (1959 tv series) episodes',
      'united states national recording registry recordings',
      'macos games',
      'virtual console games for wii u',
      'american monthly magazines',
      'broadway plays',
      'interactive achievement award winners',
      'doubleday (publisher) books',
      '19th-century classical composers',
      'film soundtracks',
      'universal deluxe editions',
      'best picture academy award winners',
      'shōnen manga',
      'west end musicals',
      'sequel novels',
      'dystopian novels',
      'american comic strips',
      'american road movies',
      'chemical elements',
      'amstrad cpc games',
      'neo-noir',
      'fiction with unreliable narrators',
      'best drama picture golden globe winners',
      'adventure anime and manga',
    ],
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
