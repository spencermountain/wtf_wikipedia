module.exports = {
  id: 'SportsTeam',
  //
  children: {},
  properties: {
    coaches: () => {},
  },
  //
  categories: {
    mapping: [
      'football clubs in england',
      'english football league clubs',
      'southern football league clubs',
      'football clubs in scotland',
      'premier league clubs',
      'national basketball association teams',
    ],
    patterns: [
      /football clubs in ./,
      /(basketball|hockey|baseball|football) teams (in|established) ./,
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
