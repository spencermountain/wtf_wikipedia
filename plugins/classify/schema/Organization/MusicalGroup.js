module.exports = {
  name: 'MusicalGroup',
  //
  children: {},
  properties: {
    albums: () => {},
  },
  //
  categories: {
    mapping: [
      'musical quartets',
      'musical duos',
      'musical trios',
      'musical quintets',
      'english rock music groups',
      'english new wave musical groups',
      'african-american musical groups',
      '21st-century american musicians',
      'american alternative metal musical groups',
      'english pop music groups',
      'art rock musical groups',
      'english post-punk music groups',
    ],
    patterns: [
      /musical groups from /,
      /musical groups (dis)?established in [0-9]{4}/,
      /musical group stubs/,
      /. music(al)? (groups|duos|trios|quartets|quintets)$/,
    ],
  },
  //
  descriptions: {
    patterns: [/rock band/],
  },
  //
  infoboxes: {
    mapping: ['musical_artist'],
    patterns: [],
  },
  //
  sections: {
    mapping: [
      'band members',
      'albums',
      'studio albums',
      'compilation albums',
      'live albums',
      'compilations',
      'eps',
    ],
    patterns: [],
  },
  //
  templates: {
    mapping: ['allmusic'],
    patterns: [],
  },
  //
  titles: {
    mapping: [
      'band',
      'american band',
      'australian band',
      'canadian band',
      'uk band',
      'japanese band',
      'swedish band',
    ],
    patterns: [],
  },
}
