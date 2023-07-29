export default {
  name: 'SportsEvent',
  children: {},
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
    mapping: [
      'athletics_championships',
      'australian_rules_football_season',
      'badminton_event',
      'boxingmatch',
      'canadian_football_game',
      'cricket_tour',
      'cricket_tournament',
      'cycling_race_report',
      'fila_wrestling_event',
      'football_club_season',
      'football_country_season',
      'football_league_season',
      'football_match',
      'football_tournament_season',
      'football_tournament',
      'international_football_competition',
      'international_ice_hockey_competition',
      'little_league_world_series',
      'mma_event',
      'nba_season',
      'ncaa_baseball_conference_tournament',
      'ncaa_football_single_game',
      'ncaa_team_season',
      'nfl_season',
      'nfl_single_game',
      'olympic_event',
      'sports_season',
      'tennis_event',
      'tennis_grand_slam_events',
      'world_series_expanded',
      'wrestling_event',
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
    mapping: [],
    patterns: [],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
