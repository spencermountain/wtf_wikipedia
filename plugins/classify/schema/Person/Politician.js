module.exports = {
  id: 'Politician',
  //
  children: {},
  properties: {
    parties: () => {},
  },
  //
  categories: {
    mapping: [
      'uk mps 2001–05',
      'uk mps 1997–2001',
      'uk mps 2005–10',
      'uk mps 1992–97',
      'labour party (uk) mps for english constituencies',
      'conservative party (uk) mps for english constituencies',
      'uk mps 1987–92',
      'uk mps 2010–15',
      'democratic party members of the united states house of representatives',
      'republican party members of the united states house of representatives',
      'uk mps 1983–87',
      'democratic party state governors of the united states',
      'california republicans',
      'british secretaries of state',
      'democratic party united states senators',
      'uk mps 2015–17',
      'republican party united states senators',
      'republican party state governors of the united states',
      'california democrats',
      'uk mps 1979–83',
      'uk mps 2017–',
    ],
    patterns: [
      /politicians from ./,
      /politician stubs$/,
      /. (democrats|republicans|politicians)$/,
      /mayors of ./,
    ],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'canadianmp',
      'governor',
      'indian_politician',
      'mp',
      'officeholder',
      'politician',
      'politician_(general)',
      'president',
      'roman_emperor',
      'state_representative',
      'state_senator',
      'congressman',
      'prime minister',
      'indian politician',
      'senator',
      'state representative',
      'state senator',
      'us cabinet official',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [],
  },
  //
  templates: {
    mapping: ['list of united states senators congress'],
    patterns: [/(politician|mayor)-stub$/],
  },
  //
  titles: {
    mapping: [
      'australian politician',
      'canadian politician',
      'politician',
      'british politician',
      'governor',
      'irish politician',
      'mayor',
    ],
    patterns: [],
  },
}
