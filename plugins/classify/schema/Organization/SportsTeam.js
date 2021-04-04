module.exports = {
  name: 'SportsTeam',
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
    patterns: [/(basketball|hockey|soccer|football|sports) team/],
  },
  //
  infoboxes: {
    mapping: [
      'basketball_club',
      'pro_hockey_team',
      'college_ice_hockey_team',
      'college_soccer_team',
      'cricket_team',
      'football_club',
      'non_test_cricket_team',
      'non-profit',
      'rugby_league_club',
      'rugby_league_representative_team',
      'rugby_team',
      'baseball team',
      'football club',
      'rugby team',
      'national football team',
      'basketball club',
      'hockey team',
      'rugby league club',
      'football club infobox',
      'cricket team',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: ['coaching staff', 'head coaches', 'team records', 'current squad'],
    patterns: [],
  },
  //
  templates: {
    mapping: [],
    patterns: [/-sport-team-stub$/],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
