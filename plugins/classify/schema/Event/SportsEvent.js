module.exports = {
  id: 'SportsEvent',
  children: {},
  properties: {
    winners: () => {},
  },
  //
  categories: {
    mapping: [
      '1904 summer olympics events',
      '1900 summer olympics events',
      '2002 winter olympics events',
    ],
    patterns: [
      /. league seasons$/,
      /^(19|20)[0-9]{2} in (soccer|football|rugby|tennis|basketball|baseball|cricket|sports)/,
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
