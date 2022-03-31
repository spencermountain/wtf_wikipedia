export default {
  name: 'SportsEvent',
  children: {},
  properties: {
    winners: () => { },
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
    mapping: [
      'athletics_championships',
      'badminton_event',
      'boxingmatch',
      'fila_wrestling_event',
      'football_club_season',
      'football_country_season',
      'football_league_season',
      'football_match',
      'football_tournament_season',
      'little_league_world_series',
      'nba_season',
      'ncaa_baseball_conference_tournament',
      'ncaa_football_single_game',
      'ncaa_team_season',
      'nfl_season',
      'nfl_single_game',
      'sports_season',
      'tennis_event',
      'tennis_grand_slam_events',
      'wrestling_event',
      'football tournament',
      'olympic event',
      'international football competition',
      'wrestling event',
      'sports season',
      'cycling race report',
      'ncaa team season',
      'cricket tournament',
      'football match',
      'world series expanded',
      'mma event',
      'nfl season',
      'nfl draft',
      'athletics championships',
      'football club season',
      'canadian football game',
      'australian rules football season',
      'football tournament season',
      'international ice hockey competition',
      'cricket tour',
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
