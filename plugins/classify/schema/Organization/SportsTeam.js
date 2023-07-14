export default {
  name: 'SportsTeam',
  //
  children: {},
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
      'baseball_team',
      'football_club',
      'rugby_team',
      'national_football_team',
      'basketball_club',
      'hockey_team',
      'rugby_league_club',
      'football_club_infobox',
      'cricket_team',
      'college_baseball_team',
      'college_basketball_team',
      'college_cross_country_team',
      'college_fencing_team',
      'college_golf_team',
      'college_gymnastics_team',
      'college_lacrosse_team',
      'college_rifle_team',
      'college_rowing_team',
      'college_sailing_team',
      'college_ski_team',
      'college_soccer_team',
      'college_softball_team',
      'college_swim_team',
      'college_tennis_team',
      'college_track_and_field_team',
      'college_volleyball_team',
      'college_water_polo_team',
      'college_wrestling_team',
      'college_football_team',
      'college_ice_hockey_team',
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
