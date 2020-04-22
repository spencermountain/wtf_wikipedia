/* wtf-plugin-classify 0.2.0  MIT */
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var _mapping;

var mapping = (_mapping = {
  actor: 'Person/Actor',
  //1
  adult_biography: 'Person',
  //2
  afl_biography: 'Person/Athlete',
  //7
  aircraft_accident: 'Event/Disaster',
  //2
  //aircraft_begin: 'Thing', //24
  //aircraft_engine: 'Thing', //2
  //aircraft_type: 'Thing', //21
  airline: 'Organization',
  //9
  airliner_accident: 'Event/Disaster',
  //3
  airport: 'Place/Structure',
  //20
  album: 'CreativeWork/Album',
  //466
  alpine_ski_racer: 'Person/Athlete',
  //2
  amusement_park: 'Place',
  //4
  ancient_site: 'Place',
  //14
  archbishop: 'Person/ReligiousFigure',
  //1
  architect: 'Person',
  //9
  // artifact: 'Thing', //1
  artist: 'Person/Artist',
  //42
  artwork: 'CreativeWork',
  //14
  athlete: 'Person/Athlete',
  //6
  athletics_championships: 'Event/SportsEvent',
  //6
  australian_place: 'Place',
  //18
  automobile: 'Product',
  //8
  badminton_event: 'Event/SportsEvent',
  //2
  baseball_biography: 'Person/Athlete',
  //64
  basketball_biography: 'Person/Athlete',
  //17
  basketball_club: 'Organization/SportsTeam',
  //17
  pro_hockey_team: 'Organization/SportsTeam',
  //
  beauty_pageant: 'Event',
  //4
  beverage: 'Product',
  //7
  body_of_water: 'Place/BodyOfWater',
  //7
  book: 'CreativeWork/Book',
  //130
  book_series: 'CreativeWork',
  //4
  boxer: 'Person/Athlete',
  //5
  boxingmatch: 'Event/SportsEvent',
  //2
  bridge: 'Place/Structure',
  //5
  broadcast: 'CreativeWork',
  //10
  broadcasting_network: 'Organization',
  //4
  building: 'Place/Structure',
  //29
  canadianmp: 'Person/Politician',
  //18
  casino: 'Place',
  //1
  cbb_team: 'Organization',
  //1
  cemetery: 'Place',
  //3
  cfl_player: 'Person/Athlete',
  //2
  character: 'FictionalCharacter',
  //12
  chef: 'Person',
  //6
  chess_player: 'Person',
  //2
  choir: 'Organization',
  //1
  christian_leader: 'Person',
  //17
  church: 'Place',
  //10
  civil_conflict: 'Event',
  //3
  college: 'Organization',
  //2
  college_coach: 'Person',
  //18
  college_football_player: 'Person',
  //7
  college_ice_hockey_team: 'Organization/SportsTeam',
  //1
  college_soccer_team: 'Organization/SportsTeam',
  //3
  comedian: 'Person',
  //3
  comic_book_title: 'CreativeWork',
  //9
  comic_strip: 'CreativeWork',
  //1
  comics_character: 'FictionalCharacter',
  //13
  comics_creator: 'Person',
  //10
  company: 'Organization',
  //150
  // computer_hardware_bus: 'Thing', //1
  // computer_virus: 'Thing/Software', //1
  concert_tour: 'Event',
  //8
  court_case: 'Event',
  //8
  cpu: 'Product',
  //1
  cricket_ground: 'Place',
  //2
  cricket_team: 'Organization/SportsTeam',
  //1
  cricketer: 'Person/Athlete',
  //43
  criminal: 'Person',
  //8
  cyclist: 'Person/Athlete',
  //8
  dam: 'Place',
  //4
  doctor_who_episode: 'CreativeWork',
  //3
  'dot-com_company': 'Organization',
  //3
  earthquake: 'Event/Disaster',
  //2
  economist: 'Person/Academic',
  //4
  election: 'Event/Election',
  //19
  electric_vehicle: 'Product',
  //1
  engineer: 'Person',
  //2
  // enzyme: 'Thing', //19
  event: 'Event',
  //2
  fashion_designer: 'Person',
  //2
  feature_on_mars: 'Place',
  //1
  field_hockey_player: 'Person/Athlete',
  //8
  figure_skater: 'Person/Athlete',
  //3
  fila_wrestling_event: 'Event/SportsEvent',
  //1
  // file_format: 'Thing', //3
  film: 'CreativeWork/Film',
  //183
  film_awards: 'Organization',
  //1
  film_festival: 'Organization',
  //2
  //// food: 'Thing', //3
  football_biography: 'Person',
  //324
  football_club: 'Organization/SportsTeam',
  //42
  football_club_season: 'Event/SportsEvent',
  //13
  football_country_season: 'Event/SportsEvent',
  //5
  football_league: 'Organization',
  //4
  football_league_season: 'Event/SportsEvent',
  //17
  football_match: 'Event/SportsEvent',
  //10
  football_tournament_season: 'Event/SportsEvent',
  //4
  former_country: 'Place',
  //14
  former_subdivision: 'Place',
  //3
  french_commune: 'Place',
  //6
  gaa_club: 'Organization',
  //2
  gaa_player: 'Person/Athlete',
  //15
  // game: 'Thing', //3
  // gene: 'Thing', //3
  german_location: 'Place',
  //6
  golf_facility: 'Place',
  //2
  golfer: 'Person/Athlete',
  //9
  government_agency: 'Organization',
  //7
  government_cabinet: 'Organization',
  //7
  governor: 'Person/Politician',
  //5
  gpu: 'Product',
  //1
  gridiron_football_person: 'Person',
  //11
  gymnast: 'Person/Athlete',
  //2
  handball_biography: 'Person',
  //8
  hindu_leader: 'Person',
  //1
  historic_site: 'Place',
  //3
  historical_era: 'Event',
  //1
  holiday: 'Event',
  //5
  hollywood_cartoon: 'CreativeWork',
  //4
  horseraces: 'Event',
  //8
  horseracing_personality: 'Person',
  //2
  hospital: 'Place',
  //14
  hotel: 'Place',
  //3
  hurricane: 'Event/Disaster',
  //1
  ice_hockey_player: 'Person/Athlete',
  //15
  indian_politician: 'Person/Politician',
  //1
  individual_snooker_tournament: 'Event',
  //6
  // information_appliance: 'Thing', //6
  // instrument: 'Thing', //3
  islands: 'Place',
  //32
  israel_village: 'Place',
  //2
  italian_comune: 'Place',
  //1
  journal: 'Organization',
  //23
  judge: 'Person',
  //8
  // judo_technique: 'Thing', //2
  laboratory: 'Organization',
  //1
  lacrosse_player: 'Person/Athlete',
  //6
  lake: 'Place/BodyOfWater',
  //10
  launch_pad: 'Place',
  //1
  law_enforcement_agency: 'Organization',
  //1
  legislative_term: 'Event',
  //1
  legislature: 'Organization',
  //3
  library: 'Organization',
  //9
  // ligament: 'Thing', //1
  little_league_world_series: 'Event/SportsEvent',
  //5
  magazine: 'CreativeWork',
  //15
  // martial_art: 'Thing', //2
  martial_artist: 'Person/Athlete',
  //13
  mass_murderer: 'Person',
  //1
  // medical_condition: 'Thing', //31
  medical_person: 'Person',
  //5
  military_conflict: 'Event/MilitaryConflict',
  //27
  military_memorial: 'Place',
  //2
  military_person: 'Person',
  //60
  military_structure: 'Place',
  //15
  military_unit: 'Organization',
  //33
  // mineral: 'Thing', //5
  minister: 'Person/ReligiousFigure',
  //3
  mlb_player: 'Person/Athlete',
  //8
  mobile_phone: 'Product',
  //3
  model: 'Person',
  //2
  monarch: 'Person',
  //23
  monument: 'Place',
  //1
  motorcycle: 'Product',
  //5
  mountain: 'Place',
  //59
  mountain_pass: 'Place',
  //1
  mountain_range: 'Place',
  //13
  mp: 'Person/Politician',
  //13
  museum: 'Place',
  //13
  music_festival: 'Event',
  //5
  // music_genre: 'Thing', //5
  musical: 'CreativeWork',
  //3
  musical_artist: 'Organization/MusicalGroup',
  //226
  musical_composition: 'CreativeWork',
  //7
  nascar_driver: 'Person',
  //3
  national_military: 'Organization',
  //4
  nba_biography: 'Person/Athlete',
  //4
  nba_season: 'Event/SportsEvent',
  //6
  ncaa_baseball_conference_tournament: 'Event/SportsEvent',
  //6
  ncaa_football_school: 'Organization',
  //4
  ncaa_football_single_game: 'Event/SportsEvent',
  //1
  ncaa_team_season: 'Event/SportsEvent',
  //17
  neighborhood_portland_or: 'Place',
  //3
  // network: 'Thing', //3
  // networking_protocol: 'Thing', //1
  newspaper: 'Organization',
  //18
  nfl_biography: 'Person/Athlete',
  //7
  nfl_draft: 'Event',
  //2
  nfl_player: 'Person/Athlete',
  //36
  nfl_season: 'Event/SportsEvent',
  //27
  nfl_single_game: 'Event/SportsEvent',
  //1
  nobility: 'Organization',
  //5
  non_test_cricket_team: 'Organization/SportsTeam',
  //4
  'non-profit': 'Organization/SportsTeam',
  //6
  officeholder: 'Person/Politician',
  //133
  oil_field: 'Place',
  //1
  opera: 'CreativeWork',
  //3
  organization: 'Organization',
  //41
  // os: 'Thing', //1
  painting: 'CreativeWork',
  //2
  pandemic: 'Event/Disaster',
  //2
  park: 'Place',
  //15
  pba_draft: 'Event',
  //3
  person: 'Person',
  //441
  philosopher: 'Person',
  //16
  police_officer: 'Person',
  //2
  political_party: 'Organization/PoliticalParty',
  //25
  politician: 'Person/Politician',
  //34
  'politician_(general)': 'Person/Politician',
  //2
  power_station: 'Place/Structure',
  //3
  // prepared_food: 'Thing', //12
  presenter: 'Person',
  //4
  president: 'Person/Politician',
  //1
  prison: 'Place',
  //4
  professional_wrestler: 'Person/Athlete',
  //9
  // programming_language: 'Thing', //6
  // protein_family: 'Thing', //2
  province_or_territory_of_canada: 'Place',
  //1
  public_transit: 'Organization',
  //1
  publisher: 'Organization',
  //3
  racing_driver: 'Person',
  //4
  radio_show: 'CreativeWork',
  //3
  radio_station: 'Organization',
  //25
  rail_line: 'Organization',
  //7
  rail_service: 'Organization',
  //6
  reality_music_competition: 'Event',
  //1
  record_label: 'Organization',
  //7
  recurring_event: 'Event',
  //3
  religious_biography: 'Person',
  //9
  religious_building: 'Place/Structure',
  //9
  // religious_text: 'Thing', //1
  river: 'Place/BodyOfWater',
  //16
  road: 'Place',
  //41
  road_small: 'Place',
  //14
  // rocket: 'Thing', //3
  roman_emperor: 'Person/Politician',
  //2
  royalty: 'Person',
  //77
  rugby_biography: 'Person/Athlete',
  //12
  rugby_league_biography: 'Person/Athlete',
  //24
  rugby_league_club: 'Organization/SportsTeam',
  //5
  rugby_league_representative_team: 'Organization/SportsTeam',
  //1
  rugby_team: 'Organization/SportsTeam',
  //11
  russian_inhabited_locality: 'Place',
  //1
  russian_town: 'Place',
  //4
  'russian_urban-type_settlement': 'Place',
  //2
  saint: 'Person/ReligiousFigure',
  //14
  scholar: 'Person/Academic',
  //2
  school: 'Place',
  //95
  school_district: 'Organization',
  //10
  scientist: 'Person/Academic',
  //84
  scotland_council_area: 'Place',
  //2
  sea: 'Place/BodyOfWater',
  //3
  settlement: 'Place',
  //642
  // sheep_breed: 'Thing', //1
  // ship_begin: 'Thing', //84
  // ship_career: 'Thing', //141
  // ship_characteristics: 'Thing', //86
  // ship_class_overview: 'Thing', //25
  // ship_image: 'Thing', //84
  shopping_mall: 'Place',
  //9
  skier: 'Person/Athlete',
  //14
  soap_character: 'FictionalCharacter',
  //126
  // software: 'Thing/Software', //25
  // software_license: 'Thing', //1
  song: 'CreativeWork',
  //30
  song_contest: 'Event',
  //3
  song_contest_entry: 'CreativeWork',
  //12
  south_african_subplace_2011: 'Place',
  //1
  spaceflight: 'Event/SpaceMission',
  //17
  'spaceflight/dock': 'Event/SpaceMission',
  //17
  'spaceflight/ip': 'Event/SpaceMission',
  //19
  // sport: 'Thing', //2
  sport_governing_body: 'Organization',
  //3
  sports_league: 'Organization',
  //7
  sports_season: 'Event/SportsEvent',
  //3
  sportsperson: 'Person',
  //45
  squash_player: 'Person/Athlete',
  //1
  stadium: 'Place/Structure',
  //14
  state: 'Place',
  //1
  state_representative: 'Person/Politician',
  //10
  state_senator: 'Person/Politician',
  //5
  station: 'Place',
  //40
  street: 'Place',
  //1
  // subdivision_type: 'Thing', //1
  summit: 'Event',
  //2
  swimmer: 'Person/Athlete',
  //14
  swiss_town: 'Place',
  //36
  // symptom: 'Thing', //2
  synthesizer: 'Product',
  //1
  television: 'Product',
  //94
  television_channel: 'Organization',
  //1
  television_episode: 'CreativeWork',
  //26
  television_season: 'CreativeWork',
  //18
  temple: 'Place',
  //2
  tennis_biography: 'Person/Athlete',
  //5
  tennis_event: 'Event/SportsEvent',
  //3
  tennis_grand_slam_events: 'Event/SportsEvent',
  //2
  // thoroughbred_racehorse: 'Thing', //7
  town_at: 'Place',
  //1
  // train: 'Thing', //2
  treaty: 'CreativeWork',
  //2
  tv_channel: 'Organization',
  //12
  'u.s._cabinet': 'Organization',
  //3
  'u.s._legislation': 'Organization',
  //3
  'u.s._metropolitan_area': 'Place',
  //1
  'u.s._state': 'Place',
  //3
  uk_constituency: 'Place',
  //1
  uk_disused_station: 'Place',
  //8
  uk_legislation: 'Organization',
  //6
  uk_place: 'Place',
  //22
  uk_school: 'Place',
  //26
  unesco_world_heritage_site: 'Place',
  //3
  // united_states_federal_proposed_legislation: 'Thing', //1
  university: 'Organization',
  //44
  university_of_notre_dame_residence_hall: 'Place',
  //1
  v8_supercar_team: 'Organization',
  //3
  venue: 'Place',
  //6
  video_game: 'CreativeWork',
  //81
  volleyball_biography: 'Person/Athlete',
  //1
  volleyball_player: 'Person/Athlete',
  //4
  waterfall: 'Place',
  //4
  // weapon: 'Thing', //15
  // website: 'Thing/Software', //5
  windmill: 'Place',
  //1
  wrc_driver: 'Person',
  //1
  wrestling_event: 'Event/SportsEvent',
  //8
  writer: 'Person',
  //69
  // writing_system: 'Thing', //4
  zoo: 'Place',
  //3
  speciesbox: 'Organism',
  'automatic taxobox': 'Organism',
  'medical condition (new)': 'MedicalCondition',
  'medical condition': 'MedicalCondition',
  constellation: 'Place/SpaceLocation',
  planet: 'Place/SpaceLocation',
  'mythical creature': 'FictionalCharacter',
  dogbreed: 'Organism',
  'dog breed': 'Organism',
  'cat breed': 'Organism',
  'grape variety': 'Organism',
  anthem: 'CreativeWork',
  'football tournament': 'Event/SportsEvent',
  'former monarchy': 'Organization',
  'criminal organization': 'Organization',
  'card game': 'Product',
  computer: 'Product',
  'laboratory equipment': 'Product',
  'baseball team': 'Organization/SportsTeam',
  // march 29th
  'video game': 'CreativeWork/VideoGame',
  'television episode': 'CreativeWork',
  'comic book title': 'CreativeWork',
  'song contest entry': 'CreativeWork',
  'short story': 'CreativeWork',
  play: 'CreativeWork/Play',
  'hollywood cartoon': 'CreativeWork',
  'radio show': 'CreativeWork',
  'simpsons episode': 'CreativeWork',
  'musical composition': 'CreativeWork',
  'book series': 'CreativeWork',
  'comic strip': 'CreativeWork',
  'd&d creature': 'FictionalCharacter',
  'television season': 'CreativeWork',
  'comics organization': 'CreativeWork',
  'doctor who episode': 'CreativeWork',
  'animanga/other': 'CreativeWork',
  'graphic novel': 'CreativeWork',
  rpg: 'CreativeWork',
  'vg character': 'FictionalCharacter',
  'big finish': 'CreativeWork',
  'vg series': 'CreativeWork',
  'name module': 'CreativeWork',
  'comics story arc': 'CreativeWork',
  'animanga character': 'FictionalCharacter',
  'video game series': 'CreativeWork',
  // 'fictional location': 'Thing',
  'futurama episode': 'CreativeWork',
  'video game character': 'FictionalCharacter',
  'comics character and title': 'CreativeWork',
  'comics meta series': 'CreativeWork',
  webcomic: 'CreativeWork',
  'the goodies episode': 'CreativeWork',
  'audio drama': 'CreativeWork',
  // 'comics species': 'Thing',
  'sw comics': 'CreativeWork',
  'media franchise': 'CreativeWork',
  'folk tale': 'CreativeWork',
  'doctor who character': 'FictionalCharacter',
  'tolkien character': 'FictionalCharacter',
  // learned events
  'military conflict': 'Event/MilitaryConflict',
  'olympic event': 'Event/SportsEvent',
  'grand prix race report': 'Event',
  'recurring event': 'Event',
  'music festival': 'Event',
  'international football competition': 'Event/SportsEvent',
  'football league season': 'Event',
  'scotus case': 'Event',
  'wrestling event': 'Event/SportsEvent',
  'court case': 'Event',
  'hockey team player': 'Person/Athlete',
  'sports season': 'Event/SportsEvent',
  'civil conflict': 'Event/MilitaryConflict',
  'concert tour': 'Event',
  'cycling race report': 'Event/SportsEvent',
  'ncaa team season': 'Event/SportsEvent',
  'cricket tournament': 'Event/SportsEvent',
  'international labour organization convention': 'Event',
  'song contest': 'Event',
  'football match': 'Event/SportsEvent',
  'australian year': 'Event',
  'world series expanded': 'Event/SportsEvent',
  'civilian attack': 'Event/MilitaryConflict',
  'mma event': 'Event/SportsEvent',
  'snooker player': 'Person',
  'airliner accident': 'Event/Disaster'
}, _defineProperty(_mapping, "football tournament", 'Event/SportsEvent'), _defineProperty(_mapping, 'individual darts tournament', 'Event'), _defineProperty(_mapping, 'nfl season', 'Event/SportsEvent'), _defineProperty(_mapping, 'beauty pageant', 'Event'), _defineProperty(_mapping, 'nfl draft', 'Event/SportsEvent'), _defineProperty(_mapping, 'athletics championships', 'Event/SportsEvent'), _defineProperty(_mapping, 'historical event', 'Event'), _defineProperty(_mapping, 'grand prix motorcycle race report', 'Event'), _defineProperty(_mapping, 'football club season', 'Event/SportsEvent'), _defineProperty(_mapping, 'international handball competition', 'Event'), _defineProperty(_mapping, 'coa case', 'Event'), _defineProperty(_mapping, 'individual snooker tournament', 'Event'), _defineProperty(_mapping, 'canadian football game', 'Event/SportsEvent'), _defineProperty(_mapping, 'australian rules football season', 'Event/SportsEvent'), _defineProperty(_mapping, 'football tournament season', 'Event/SportsEvent'), _defineProperty(_mapping, 'esc national year', 'Event'), _defineProperty(_mapping, "indy500", 'Event'), _defineProperty(_mapping, 'international ice hockey competition', 'Event/SportsEvent'), _defineProperty(_mapping, 'cricket tour', 'Event/SportsEvent'), _defineProperty(_mapping, 'national political convention', 'Event'), _defineProperty(_mapping, "referendum", 'Event'), _defineProperty(_mapping, 'football club', 'Organization/SportsTeam'), _defineProperty(_mapping, 'radio station', 'Organization'), _defineProperty(_mapping, 'military unit', 'Organization'), _defineProperty(_mapping, 'political party', 'Organization/PoliticalParty'), _defineProperty(_mapping, 'government agency', 'Organization'), _defineProperty(_mapping, 'rail line', 'Organization'), _defineProperty(_mapping, 'record label', 'Organization'), _defineProperty(_mapping, 'school district', 'Organization'), _defineProperty(_mapping, 'tv channel', 'Organization'), _defineProperty(_mapping, 'sports league', 'Organization'), _defineProperty(_mapping, 'football league', 'Organization'), _defineProperty(_mapping, "worldscouting", 'Organization'), _defineProperty(_mapping, 'rugby team', 'Organization/SportsTeam'), _defineProperty(_mapping, 'sg rail', 'Organization'), _defineProperty(_mapping, 'law enforcement agency', 'Organization'), _defineProperty(_mapping, 'uk legislation', 'Organization'), _defineProperty(_mapping, 'public transit', 'Organization'), _defineProperty(_mapping, 'us university ranking', 'Organization'), _defineProperty(_mapping, 'television channel', 'Organization'), _defineProperty(_mapping, 'national football team', 'Organization/SportsTeam'), _defineProperty(_mapping, 'bus transit', 'Organization'), _defineProperty(_mapping, "union", 'Organization'), _defineProperty(_mapping, 'broadcasting network', 'Organization'), _defineProperty(_mapping, 'christian denomination', 'Organization'), _defineProperty(_mapping, 'film awards', 'Organization'), _defineProperty(_mapping, 'gaa club', 'Organization'), _defineProperty(_mapping, "fraternity", 'Organization'), _defineProperty(_mapping, "rail", 'Organization'), _defineProperty(_mapping, 'rail service', 'Organization'), _defineProperty(_mapping, 'national military', 'Organization'), _defineProperty(_mapping, 'sport governing body', 'Organization'), _defineProperty(_mapping, 'basketball club', 'Organization/SportsTeam'), _defineProperty(_mapping, 'hockey team', 'Organization/SportsTeam'), _defineProperty(_mapping, 'political party/seats', 'Organization'), _defineProperty(_mapping, 'rugby league club', 'Organization/SportsTeam'), _defineProperty(_mapping, 'athletic conference', 'Organization'), _defineProperty(_mapping, 'football club infobox', 'Organization/SportsTeam'), _defineProperty(_mapping, 'film festival', 'Organization'), _defineProperty(_mapping, "medical condition (new)", 'Organization'), _defineProperty(_mapping, "brand", 'Organization/MusicalGroup'), _defineProperty(_mapping, 'cricket team', 'Organization/SportsTeam'), _defineProperty(_mapping, 'dot-com company', 'Organization'), _defineProperty(_mapping, 'india university ranking', 'Organization'), _defineProperty(_mapping, 'uk university rankings', 'Organization'), _defineProperty(_mapping, 'government cabinet', 'Organization'), _defineProperty(_mapping, "taxobox", 'Organism'), _defineProperty(_mapping, "subspeciesbox", 'Organism'), _defineProperty(_mapping, "mycomorphbox", 'Organism'), _defineProperty(_mapping, 'paraphyletic group', 'Organism'), _defineProperty(_mapping, 'nutritional value', 'Organism'), _defineProperty(_mapping, "infraspeciesbox", 'Organism'), _defineProperty(_mapping, "disease", 'MedicalCondition'), _defineProperty(_mapping, "ecoregion", 'Place'), _defineProperty(_mapping, "horse", 'Organism'), _defineProperty(_mapping, "haplogroup", 'Organism'), _defineProperty(_mapping, "bird", 'Organism'), _defineProperty(_mapping, 'bird/population', 'Organism'), _defineProperty(_mapping, 'medical resources', 'Organism'), _defineProperty(_mapping, "galaxy", 'Place/SpaceLocation'), _defineProperty(_mapping, 'nc name', 'Organism'), _defineProperty(_mapping, 'pig breed', 'Organism'), _defineProperty(_mapping, 'botanical product', 'Organism'), _defineProperty(_mapping, 'cattle breed', 'Organism'), _defineProperty(_mapping, "bishop", 'Person/ReligiousFigure'), _defineProperty(_mapping, 'horse breed', 'Organism'), _defineProperty(_mapping, 'poultry breed', 'Organism'), _defineProperty(_mapping, 'football biography', 'Person/Athlete'), _defineProperty(_mapping, 'military person', 'Person'), _defineProperty(_mapping, 'baseball biography', 'Person/Athlete'), _defineProperty(_mapping, 'ice hockey player', 'Person/Athlete'), _defineProperty(_mapping, 'nfl player', 'Person/Athlete'), _defineProperty(_mapping, 'christian leader', 'Person/ReligiousFigure'), _defineProperty(_mapping, "congressman", 'Person/Politician'), _defineProperty(_mapping, 'basketball biography', 'Person/Athlete'), _defineProperty(_mapping, 'comics creator', 'Person/Artist'), _defineProperty(_mapping, 'professional wrestler', 'Person/Athlete'), _defineProperty(_mapping, 'college coach', 'Person'), _defineProperty(_mapping, 'tennis biography', 'Person/Athlete'), _defineProperty(_mapping, 'afl biography', 'Person/Athlete'), _defineProperty(_mapping, 'nfl biography', 'Person/Athlete'), _defineProperty(_mapping, 'rugby biography', 'Person/Athlete'), _defineProperty(_mapping, 'rugby league biography', 'Person/Athlete'), _defineProperty(_mapping, 'prime minister', 'Person/Politician'), _defineProperty(_mapping, 'nba biography', 'Person/Athlete'), _defineProperty(_mapping, 'figure skater', 'Person/Athlete'), _defineProperty(_mapping, 'f1 driver', 'Person'), _defineProperty(_mapping, 'gridiron football person', 'Person'), _defineProperty(_mapping, 'indian politician', 'Person/Politician'), _defineProperty(_mapping, 'racing driver', 'Person'), _defineProperty(_mapping, 'martial artist', 'Person'), _defineProperty(_mapping, 'chinese-language singer and actor', 'Person'), _defineProperty(_mapping, "astronaut", 'Person'), _defineProperty(_mapping, "senator", 'Person/Politician'), _defineProperty(_mapping, 'nascar driver', 'Person'), _defineProperty(_mapping, 'adult biography', 'Person'), _defineProperty(_mapping, 'state representative', 'Person/Politician'), _defineProperty(_mapping, 'state senator', 'Person/Politician'), _defineProperty(_mapping, 'coa wide', 'Person'), _defineProperty(_mapping, 'religious biography', 'Person/ReligiousFigure'), _defineProperty(_mapping, 'chess player', 'Person'), _defineProperty(_mapping, 'pageant titleholder', 'Person'), _defineProperty(_mapping, 'gaa player', 'Person/Athlete'), _defineProperty(_mapping, 'us cabinet official', 'Person/Politician'), _defineProperty(_mapping, 'uk place', 'Place'), _defineProperty(_mapping, 'italian comune', 'Place'), _defineProperty(_mapping, "geobox", 'Place'), _defineProperty(_mapping, 'australian place', 'Place'), _defineProperty(_mapping, 'french commune', 'Place'), _defineProperty(_mapping, 'german location', 'Place'), _defineProperty(_mapping, 'u.s. county', 'Place'), _defineProperty(_mapping, 'swiss town', 'Place/City'), _defineProperty(_mapping, 'former country', 'Place'), _defineProperty(_mapping, 'uk school', 'Place/Structure'), _defineProperty(_mapping, 'road small', 'Place'), _defineProperty(_mapping, 'lunar crater', 'Place'), _defineProperty(_mapping, 'gb station', 'Place'), _defineProperty(_mapping, 'greek dimos', 'Place'), _defineProperty(_mapping, 'military structure', 'Place/Structure'), _defineProperty(_mapping, 'uk constituency main', 'Place'), _defineProperty(_mapping, 'city japan', 'Place/City'), _defineProperty(_mapping, 'religious building', 'Place/Structure'), _defineProperty(_mapping, 'shopping mall', 'Place/Structure'), _defineProperty(_mapping, 'municipality br', 'Place/City'), _defineProperty(_mapping, 'finnish municipality/population count', 'Place'), _defineProperty(_mapping, 'ancient site', 'Place'), _defineProperty(_mapping, 'mountain range', 'Place'), _defineProperty(_mapping, 'london station', 'Place'), _defineProperty(_mapping, 'russian town', 'Place/City'), _defineProperty(_mapping, 'former subdivision', 'Place'), _defineProperty(_mapping, "lighthouse", 'Place/Structure'), _defineProperty(_mapping, 'uk station', 'Place'), _defineProperty(_mapping, 'historic site', 'Place'), _defineProperty(_mapping, 'world heritage site', 'Place'), _defineProperty(_mapping, "diocese", 'Place'), _defineProperty(_mapping, 'south african town 2011', 'Place/City'), _defineProperty(_mapping, 'uk disused station', 'Place'), _defineProperty(_mapping, 'belgium municipality', 'Place'), _defineProperty(_mapping, 'uk constituency', 'Place'), _defineProperty(_mapping, "theatre", 'Place'), _defineProperty(_mapping, 'canada electoral district', 'Place'), _defineProperty(_mapping, "nycs", 'Place'), _defineProperty(_mapping, 'body of water', 'Place/BodyOfWater'), _defineProperty(_mapping, 'mountain pass', 'Place'), _defineProperty(_mapping, "kommune", 'Place'), _defineProperty(_mapping, 'historic subdivision', 'Place'), _defineProperty(_mapping, 'u.s. congressional district', 'Place'), _defineProperty(_mapping, 'power station', 'Place/Structure'), _mapping);
var mapping_1 = mapping.actor;
var mapping_2 = mapping.adult_biography;
var mapping_3 = mapping.afl_biography;
var mapping_4 = mapping.aircraft_accident;
var mapping_5 = mapping.airline;
var mapping_6 = mapping.airliner_accident;
var mapping_7 = mapping.airport;
var mapping_8 = mapping.album;
var mapping_9 = mapping.alpine_ski_racer;
var mapping_10 = mapping.amusement_park;
var mapping_11 = mapping.ancient_site;
var mapping_12 = mapping.archbishop;
var mapping_13 = mapping.architect;
var mapping_14 = mapping.artist;
var mapping_15 = mapping.artwork;
var mapping_16 = mapping.athlete;
var mapping_17 = mapping.athletics_championships;
var mapping_18 = mapping.australian_place;
var mapping_19 = mapping.automobile;
var mapping_20 = mapping.badminton_event;
var mapping_21 = mapping.baseball_biography;
var mapping_22 = mapping.basketball_biography;
var mapping_23 = mapping.basketball_club;
var mapping_24 = mapping.pro_hockey_team;
var mapping_25 = mapping.beauty_pageant;
var mapping_26 = mapping.beverage;
var mapping_27 = mapping.body_of_water;
var mapping_28 = mapping.book;
var mapping_29 = mapping.book_series;
var mapping_30 = mapping.boxer;
var mapping_31 = mapping.boxingmatch;
var mapping_32 = mapping.bridge;
var mapping_33 = mapping.broadcast;
var mapping_34 = mapping.broadcasting_network;
var mapping_35 = mapping.building;
var mapping_36 = mapping.canadianmp;
var mapping_37 = mapping.casino;
var mapping_38 = mapping.cbb_team;
var mapping_39 = mapping.cemetery;
var mapping_40 = mapping.cfl_player;
var mapping_41 = mapping.character;
var mapping_42 = mapping.chef;
var mapping_43 = mapping.chess_player;
var mapping_44 = mapping.choir;
var mapping_45 = mapping.christian_leader;
var mapping_46 = mapping.church;
var mapping_47 = mapping.civil_conflict;
var mapping_48 = mapping.college;
var mapping_49 = mapping.college_coach;
var mapping_50 = mapping.college_football_player;
var mapping_51 = mapping.college_ice_hockey_team;
var mapping_52 = mapping.college_soccer_team;
var mapping_53 = mapping.comedian;
var mapping_54 = mapping.comic_book_title;
var mapping_55 = mapping.comic_strip;
var mapping_56 = mapping.comics_character;
var mapping_57 = mapping.comics_creator;
var mapping_58 = mapping.company;
var mapping_59 = mapping.concert_tour;
var mapping_60 = mapping.court_case;
var mapping_61 = mapping.cpu;
var mapping_62 = mapping.cricket_ground;
var mapping_63 = mapping.cricket_team;
var mapping_64 = mapping.cricketer;
var mapping_65 = mapping.criminal;
var mapping_66 = mapping.cyclist;
var mapping_67 = mapping.dam;
var mapping_68 = mapping.doctor_who_episode;
var mapping_69 = mapping.earthquake;
var mapping_70 = mapping.economist;
var mapping_71 = mapping.election;
var mapping_72 = mapping.electric_vehicle;
var mapping_73 = mapping.engineer;
var mapping_74 = mapping.event;
var mapping_75 = mapping.fashion_designer;
var mapping_76 = mapping.feature_on_mars;
var mapping_77 = mapping.field_hockey_player;
var mapping_78 = mapping.figure_skater;
var mapping_79 = mapping.fila_wrestling_event;
var mapping_80 = mapping.film;
var mapping_81 = mapping.film_awards;
var mapping_82 = mapping.film_festival;
var mapping_83 = mapping.football_biography;
var mapping_84 = mapping.football_club;
var mapping_85 = mapping.football_club_season;
var mapping_86 = mapping.football_country_season;
var mapping_87 = mapping.football_league;
var mapping_88 = mapping.football_league_season;
var mapping_89 = mapping.football_match;
var mapping_90 = mapping.football_tournament_season;
var mapping_91 = mapping.former_country;
var mapping_92 = mapping.former_subdivision;
var mapping_93 = mapping.french_commune;
var mapping_94 = mapping.gaa_club;
var mapping_95 = mapping.gaa_player;
var mapping_96 = mapping.german_location;
var mapping_97 = mapping.golf_facility;
var mapping_98 = mapping.golfer;
var mapping_99 = mapping.government_agency;
var mapping_100 = mapping.government_cabinet;
var mapping_101 = mapping.governor;
var mapping_102 = mapping.gpu;
var mapping_103 = mapping.gridiron_football_person;
var mapping_104 = mapping.gymnast;
var mapping_105 = mapping.handball_biography;
var mapping_106 = mapping.hindu_leader;
var mapping_107 = mapping.historic_site;
var mapping_108 = mapping.historical_era;
var mapping_109 = mapping.holiday;
var mapping_110 = mapping.hollywood_cartoon;
var mapping_111 = mapping.horseraces;
var mapping_112 = mapping.horseracing_personality;
var mapping_113 = mapping.hospital;
var mapping_114 = mapping.hotel;
var mapping_115 = mapping.hurricane;
var mapping_116 = mapping.ice_hockey_player;
var mapping_117 = mapping.indian_politician;
var mapping_118 = mapping.individual_snooker_tournament;
var mapping_119 = mapping.islands;
var mapping_120 = mapping.israel_village;
var mapping_121 = mapping.italian_comune;
var mapping_122 = mapping.journal;
var mapping_123 = mapping.judge;
var mapping_124 = mapping.laboratory;
var mapping_125 = mapping.lacrosse_player;
var mapping_126 = mapping.lake;
var mapping_127 = mapping.launch_pad;
var mapping_128 = mapping.law_enforcement_agency;
var mapping_129 = mapping.legislative_term;
var mapping_130 = mapping.legislature;
var mapping_131 = mapping.library;
var mapping_132 = mapping.little_league_world_series;
var mapping_133 = mapping.magazine;
var mapping_134 = mapping.martial_artist;
var mapping_135 = mapping.mass_murderer;
var mapping_136 = mapping.medical_person;
var mapping_137 = mapping.military_conflict;
var mapping_138 = mapping.military_memorial;
var mapping_139 = mapping.military_person;
var mapping_140 = mapping.military_structure;
var mapping_141 = mapping.military_unit;
var mapping_142 = mapping.minister;
var mapping_143 = mapping.mlb_player;
var mapping_144 = mapping.mobile_phone;
var mapping_145 = mapping.model;
var mapping_146 = mapping.monarch;
var mapping_147 = mapping.monument;
var mapping_148 = mapping.motorcycle;
var mapping_149 = mapping.mountain;
var mapping_150 = mapping.mountain_pass;
var mapping_151 = mapping.mountain_range;
var mapping_152 = mapping.mp;
var mapping_153 = mapping.museum;
var mapping_154 = mapping.music_festival;
var mapping_155 = mapping.musical;
var mapping_156 = mapping.musical_artist;
var mapping_157 = mapping.musical_composition;
var mapping_158 = mapping.nascar_driver;
var mapping_159 = mapping.national_military;
var mapping_160 = mapping.nba_biography;
var mapping_161 = mapping.nba_season;
var mapping_162 = mapping.ncaa_baseball_conference_tournament;
var mapping_163 = mapping.ncaa_football_school;
var mapping_164 = mapping.ncaa_football_single_game;
var mapping_165 = mapping.ncaa_team_season;
var mapping_166 = mapping.neighborhood_portland_or;
var mapping_167 = mapping.newspaper;
var mapping_168 = mapping.nfl_biography;
var mapping_169 = mapping.nfl_draft;
var mapping_170 = mapping.nfl_player;
var mapping_171 = mapping.nfl_season;
var mapping_172 = mapping.nfl_single_game;
var mapping_173 = mapping.nobility;
var mapping_174 = mapping.non_test_cricket_team;
var mapping_175 = mapping.officeholder;
var mapping_176 = mapping.oil_field;
var mapping_177 = mapping.opera;
var mapping_178 = mapping.organization;
var mapping_179 = mapping.painting;
var mapping_180 = mapping.pandemic;
var mapping_181 = mapping.park;
var mapping_182 = mapping.pba_draft;
var mapping_183 = mapping.person;
var mapping_184 = mapping.philosopher;
var mapping_185 = mapping.police_officer;
var mapping_186 = mapping.political_party;
var mapping_187 = mapping.politician;
var mapping_188 = mapping.power_station;
var mapping_189 = mapping.presenter;
var mapping_190 = mapping.president;
var mapping_191 = mapping.prison;
var mapping_192 = mapping.professional_wrestler;
var mapping_193 = mapping.province_or_territory_of_canada;
var mapping_194 = mapping.public_transit;
var mapping_195 = mapping.publisher;
var mapping_196 = mapping.racing_driver;
var mapping_197 = mapping.radio_show;
var mapping_198 = mapping.radio_station;
var mapping_199 = mapping.rail_line;
var mapping_200 = mapping.rail_service;
var mapping_201 = mapping.reality_music_competition;
var mapping_202 = mapping.record_label;
var mapping_203 = mapping.recurring_event;
var mapping_204 = mapping.religious_biography;
var mapping_205 = mapping.religious_building;
var mapping_206 = mapping.river;
var mapping_207 = mapping.road;
var mapping_208 = mapping.road_small;
var mapping_209 = mapping.roman_emperor;
var mapping_210 = mapping.royalty;
var mapping_211 = mapping.rugby_biography;
var mapping_212 = mapping.rugby_league_biography;
var mapping_213 = mapping.rugby_league_club;
var mapping_214 = mapping.rugby_league_representative_team;
var mapping_215 = mapping.rugby_team;
var mapping_216 = mapping.russian_inhabited_locality;
var mapping_217 = mapping.russian_town;
var mapping_218 = mapping.saint;
var mapping_219 = mapping.scholar;
var mapping_220 = mapping.school;
var mapping_221 = mapping.school_district;
var mapping_222 = mapping.scientist;
var mapping_223 = mapping.scotland_council_area;
var mapping_224 = mapping.sea;
var mapping_225 = mapping.settlement;
var mapping_226 = mapping.shopping_mall;
var mapping_227 = mapping.skier;
var mapping_228 = mapping.soap_character;
var mapping_229 = mapping.song;
var mapping_230 = mapping.song_contest;
var mapping_231 = mapping.song_contest_entry;
var mapping_232 = mapping.south_african_subplace_2011;
var mapping_233 = mapping.spaceflight;
var mapping_234 = mapping.sport_governing_body;
var mapping_235 = mapping.sports_league;
var mapping_236 = mapping.sports_season;
var mapping_237 = mapping.sportsperson;
var mapping_238 = mapping.squash_player;
var mapping_239 = mapping.stadium;
var mapping_240 = mapping.state;
var mapping_241 = mapping.state_representative;
var mapping_242 = mapping.state_senator;
var mapping_243 = mapping.station;
var mapping_244 = mapping.street;
var mapping_245 = mapping.summit;
var mapping_246 = mapping.swimmer;
var mapping_247 = mapping.swiss_town;
var mapping_248 = mapping.synthesizer;
var mapping_249 = mapping.television;
var mapping_250 = mapping.television_channel;
var mapping_251 = mapping.television_episode;
var mapping_252 = mapping.television_season;
var mapping_253 = mapping.temple;
var mapping_254 = mapping.tennis_biography;
var mapping_255 = mapping.tennis_event;
var mapping_256 = mapping.tennis_grand_slam_events;
var mapping_257 = mapping.town_at;
var mapping_258 = mapping.treaty;
var mapping_259 = mapping.tv_channel;
var mapping_260 = mapping.uk_constituency;
var mapping_261 = mapping.uk_disused_station;
var mapping_262 = mapping.uk_legislation;
var mapping_263 = mapping.uk_place;
var mapping_264 = mapping.uk_school;
var mapping_265 = mapping.unesco_world_heritage_site;
var mapping_266 = mapping.university;
var mapping_267 = mapping.university_of_notre_dame_residence_hall;
var mapping_268 = mapping.v8_supercar_team;
var mapping_269 = mapping.venue;
var mapping_270 = mapping.video_game;
var mapping_271 = mapping.volleyball_biography;
var mapping_272 = mapping.volleyball_player;
var mapping_273 = mapping.waterfall;
var mapping_274 = mapping.windmill;
var mapping_275 = mapping.wrc_driver;
var mapping_276 = mapping.wrestling_event;
var mapping_277 = mapping.writer;
var mapping_278 = mapping.zoo;
var mapping_279 = mapping.speciesbox;
var mapping_280 = mapping.constellation;
var mapping_281 = mapping.planet;
var mapping_282 = mapping.dogbreed;
var mapping_283 = mapping.anthem;
var mapping_284 = mapping.computer;
var mapping_285 = mapping.play;
var mapping_286 = mapping.rpg;
var mapping_287 = mapping.webcomic;
var mapping_288 = mapping.indy500;
var mapping_289 = mapping.referendum;
var mapping_290 = mapping.worldscouting;
var mapping_291 = mapping.union;
var mapping_292 = mapping.fraternity;
var mapping_293 = mapping.rail;
var mapping_294 = mapping.brand;
var mapping_295 = mapping.taxobox;
var mapping_296 = mapping.subspeciesbox;
var mapping_297 = mapping.mycomorphbox;
var mapping_298 = mapping.infraspeciesbox;
var mapping_299 = mapping.disease;
var mapping_300 = mapping.ecoregion;
var mapping_301 = mapping.horse;
var mapping_302 = mapping.haplogroup;
var mapping_303 = mapping.bird;
var mapping_304 = mapping.galaxy;
var mapping_305 = mapping.bishop;
var mapping_306 = mapping.congressman;
var mapping_307 = mapping.astronaut;
var mapping_308 = mapping.senator;
var mapping_309 = mapping.geobox;
var mapping_310 = mapping.lighthouse;
var mapping_311 = mapping.diocese;
var mapping_312 = mapping.theatre;
var mapping_313 = mapping.nycs;
var mapping_314 = mapping.kommune;

var byInfobox = function byInfobox(doc) {
  var infoboxes = doc.infoboxes();
  var found = [];

  for (var i = 0; i < infoboxes.length; i++) {
    var inf = infoboxes[i];
    var type = inf.type();
    type = type.toLowerCase(); // type = type.replace(/^(category|categorie|kategori): ?/i, '')

    type = type.replace(/ /g, '_');
    type = type.trim();

    if (mapping.hasOwnProperty(type)) {
      found.push({
        cat: mapping[type],
        reason: type
      });
    }
  }

  return found;
};

var byInfobox_1 = byInfobox;

var patterns = {
  FictionalCharacter: [/(fictional|television) characters/],
  Product: [/products introduced in ./, /musical instruments/],
  Organism: [/(funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants) of ./, / first appearances/, / . described in [0-9]{4}/, /. (phyla|genera)$/, /. taxonomic families$/, /plants used in ./, / (funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants)$/],
  // ==Person==
  'Person/Politician': [/politicians from ./, /politician stubs$/, /. (democrats|republicans|politicians)$/, /mayors of ./],
  'Person/Athlete': [/sportspeople from ./, /(footballers|cricketers|defencemen|cyclists)/],
  'Person/Actor': [/actresses/, /actors from ./, /actor stubs$/, / (actors|actresses)$/],
  'Person/Artist': [/musicians from ./, /(singers|songwriters|painters|poets)/, /novelists from ./],
  // 'Person/Scientist': [(astronomers|physicists|biologists|chemists)],
  Person: [/[0-9]{4} births/, /[0-9]{4} deaths/, /people of .* descent/, /^deaths from /, /^(people|philanthropists|writers) from ./, / (players|alumni)$/, /(alumni|fellows) of .$/, /(people|writer) stubs$/, /(american|english) (fe)?male ./, /(american|english) (architects|people)/],
  // ==Place==
  'Place/Structure': [/(buildings|bridges) completed in /, /airports established in ./, /(airports|bridges) in ./, /buildings and structures in ./],
  'Place/BodyOfWater': [/(rivers|lakes|tributaries) of ./],
  'Place/City': [/^cities and towns in ./, /(municipalities|settlements|villages|localities|townships) in ./],
  Place: [/populated places/, /landforms of ./, /railway stations/, /parks in ./, / district$/, /geography stubs$/, /sports venue stubs$/],
  // ==Creative Work==
  'CreativeWork/Album': [/[0-9]{4}.*? albums/, /^albums /, / albums$/],
  'CreativeWork/Film': [/[0-9]{4}.*? films/, / films$/, /^films /],
  'CreativeWork/TVShow': [/television series/],
  'CreativeWork/VideoGame': [/video games/],
  CreativeWork: [/(film|novel|album) stubs$/, /[0-9]{4}.*? (poems|novels)/, / (poems|novels)$/],
  // ==Event==
  'Event/SportsEvent': [/. league seasons$/, /^(19|20)[0-9]{2} in (soccer|football|rugby|tennis|basketball|baseball|cricket|sports)/],
  'Event/MilitaryConflict': [/conflicts (in|of) [0-9]{4}/, /(wars|battles|conflicts) (involving|of|in) ./],
  Event: [/^(19|20)[0-9]{2} in /, /^(years of the )?[0-9]{1,2}(st|nd|rd|th)? century in ./],
  // ==Orgs==
  'Organization/MusicalGroup': [/musical groups from /, /musical groups (dis)?established in [0-9]{4}/, /musical group stubs/, /. music(al)? (groups|duos|trios|quartets|quintets)$/],
  'Organization/SportsTeam': [/football clubs in ./, /(basketball|hockey|baseball|football) teams (in|established) ./],
  'Organization/Company': [/companies (established|based) in ./],
  Organization: [/(organi[sz]ations|publications) based in /, /(organi[sz]ations|publications|schools|awards) established in [0-9]{4}/, /(secondary|primary) schools/, /military units/, /magazines/, /organi[sz]ation stubs$/]
};
var patterns_1 = patterns;

var mapping$1 = {
  'living people': 'Person',
  'possibly living people': 'Person',
  'musical quartets': 'Organization/MusicalGroup',
  'musical duos': 'Organization/MusicalGroup',
  'musical trios': 'Organization/MusicalGroup',
  // learned march 30
  'dos games': 'CreativeWork/VideoGame',
  'virtual console games': 'CreativeWork/VideoGame',
  'mac os games': 'CreativeWork/VideoGame',
  operas: 'CreativeWork',
  'american science fiction novels': 'CreativeWork',
  'amiga games': 'CreativeWork/VideoGame',
  'broadway musicals': 'CreativeWork',
  'debut novels': 'CreativeWork',
  'the twilight zone (1959 tv series) episodes': 'CreativeWork',
  'arcade games': 'CreativeWork/VideoGame',
  'united states national recording registry recordings': 'CreativeWork',
  'commodore 64 games': 'CreativeWork/VideoGame',
  'nintendo entertainment system games': 'CreativeWork/VideoGame',
  'macos games': 'CreativeWork',
  'playstation (console) games': 'CreativeWork/VideoGame',
  'virtual console games for wii u': 'CreativeWork',
  'ios games': 'CreativeWork/VideoGame',
  'super nintendo entertainment system games': 'CreativeWork/VideoGame',
  'video game sequels': 'CreativeWork/VideoGame',
  'american monthly magazines': 'CreativeWork',
  'broadway plays': 'CreativeWork',
  'game boy advance games': 'CreativeWork/VideoGame',
  'first-person shooters': 'CreativeWork/VideoGame',
  'playstation network games': 'CreativeWork/VideoGame',
  'interactive achievement award winners': 'CreativeWork',
  'linux games': 'CreativeWork/VideoGame',
  'atari st games': 'CreativeWork/VideoGame',
  'doubleday (publisher) books': 'CreativeWork',
  '19th-century classical composers': 'CreativeWork',
  'film soundtracks': 'CreativeWork',
  'universal deluxe editions': 'CreativeWork',
  'playstation 2 games': 'CreativeWork/VideoGame',
  'best picture academy award winners': 'CreativeWork',
  'game boy games': 'CreativeWork/VideoGame',
  'shōnen manga': 'CreativeWork',
  'zx spectrum games': 'CreativeWork/VideoGame',
  'west end musicals': 'CreativeWork',
  'sequel novels': 'CreativeWork',
  'dystopian novels': 'CreativeWork',
  'american comic strips': 'CreativeWork',
  'american road movies': 'CreativeWork',
  'chemical elements': 'CreativeWork',
  'amstrad cpc games': 'CreativeWork',
  'mario universe games': 'CreativeWork/VideoGame',
  'neo-noir': 'CreativeWork',
  'multiplayer online games': 'CreativeWork/VideoGame',
  'mobile games': 'CreativeWork/VideoGame',
  'android (operating system) games': 'CreativeWork/VideoGame',
  'platform games': 'CreativeWork/VideoGame',
  'fiction with unreliable narrators': 'CreativeWork',
  'best drama picture golden globe winners': 'CreativeWork',
  'adventure anime and manga': 'CreativeWork',
  'albums recorded at abbey road studios': 'CreativeWork/Album',
  'xbox 360 live arcade games': 'CreativeWork/VideoGame',
  'sega genesis games': 'CreativeWork/VideoGame',
  //learned events
  'years in literature': 'Event',
  'years in music': 'Event',
  'years in film': 'Event',
  'united states supreme court cases': 'Event',
  'leap years in the gregorian calendar': 'Event',
  "governor general's awards": 'Event',
  'eurovision song contest by year': 'Event',
  'grammy awards ceremonies': 'Event',
  'united kingdom in the eurovision song contest': 'Event',
  'manned soyuz missions': 'Event',
  'american civil liberties union litigation': 'Event',
  may: 'Event',
  october: 'Event',
  'missions to the moon': 'Event',
  'nasa space probes': 'Event/SpaceMission',
  'world war ii british commando raids': 'Event',
  july: 'Event',
  december: 'Event',
  'wars involving the united kingdom': 'Event/MilitaryConflict',
  september: 'Event',
  november: 'Event',
  january: 'Event',
  june: 'Event',
  august: 'Event',
  april: 'Event',
  february: 'Event',
  march: 'Event',
  'conflicts in 1944': 'Event',
  'human spaceflights': 'Event/SpaceMission',
  'missions to mars': 'Event',
  'derelict space probes': 'Event/SpaceMission',
  'luna program': 'Event',
  'proxy wars': 'Event/MilitaryConflict',
  'conflicts in 1942': 'Event',
  'special air service': 'Event',
  'spacecraft launched by delta ii rockets': 'Event/SpaceMission',
  'soft landings on the moon': 'Event',
  'may observances': 'Event',
  '1904 summer olympics events': 'Event/SportsEvent',
  '1900 summer olympics events': 'Event/SportsEvent',
  'space shuttle missions': 'Event/SpaceMission',
  'apollo program missions': 'Event/SpaceMission',
  'spacecraft launched in 1962': 'Event/SpaceMission',
  'spacecraft launched by titan rockets': 'Event/SpaceMission',
  'first events': 'Event',
  'recent years': 'Event',
  'elections not won by the popular vote winner': 'Event',
  'conflicts in 1864': 'Event',
  '1862 in the american civil war': 'Event',
  'new zealand wars': 'Event/MilitaryConflict',
  'battles between england and scotland': 'Event/MilitaryConflict',
  '2002 winter olympics events': 'Event/SportsEvent',
  'spacecraft launched by atlas-centaur rockets': 'Event/SpaceMission',
  'space observatories': 'Event/SpaceMission',
  'new york (state) in the american revolution': 'Event',
  'march observances': 'Event',
  'public holidays in the united states': 'Event',
  'conflicts in 1943': 'Event/MilitaryConflict',
  'spacecraft launched in 1966': 'Event/SpaceMission',
  'last stand battles': 'Event/MilitaryConflict',
  '1944 in france': 'Event',
  'battles and conflicts without fatalities': 'Event/MilitaryConflict',
  'manned missions to the moon': 'Event/SpaceMission',
  'sample return missions': 'Event/SpaceMission',
  '1973 in spaceflight': 'Event/SpaceMission',
  'guerrilla wars': 'Event/MilitaryConflict',
  'retired atlantic hurricanes': 'Event/Disaster',
  'december observances': 'Event',
  '20th century american trials': 'Event',
  'african-american civil rights movement (1954–68)': 'Event',
  '20th-century conflicts': 'Event/MilitaryConflict',
  'presidential elections in ireland': 'Event/Election',
  'spacecraft launched in 1973': 'Event/SpaceMission',
  'october observances': 'Event',
  'spring holidays': 'Event',
  'years in aviation': 'Event',
  'national days': 'Event',
  'project gemini missions': 'Event/SpaceMission',
  'spacecraft launched in 1965': 'Event/SpaceMission',
  '20th-century revolutions': 'Event/MilitaryConflict',
  'spacecraft launched in 1971': 'Event/SpaceMission',
  'fifa world cup tournaments': 'Event/SpaceMission',
  'summer holidays': 'Event',
  'sieges involving japan': 'Event/MilitaryConflict',
  'lunar flybys': 'Event/SpaceMission',
  'apollo program': 'Event',
  'revolution-based civil wars': 'Event/MilitaryConflict',
  // learned organisms
  'taxa named by carl linnaeus': 'Organism',
  'ornamental trees': 'Organism',
  'birds by common name': 'Organism',
  'living fossils': 'Organism',
  'taxa named by john edward gray': 'Organism',
  phelsuma: 'Organism',
  multituberculates: 'Organism',
  'angiosperm orders': 'Organism',
  cimolodonts: 'Organism',
  'urban animals': 'Organism',
  flowers: 'Organism',
  geckos: 'Organism',
  herbs: 'Organism',
  spices: 'Organism',
  skinks: 'Organism',
  'cretaceous mammals': 'Organism',
  'commercial fish': 'Organism',
  'paleocene mammals': 'Organism',
  'bird families': 'Organism',
  'edible nuts and seeds': 'Organism',
  'invasive plant species': 'Organism',
  'leaf vegetables': 'Organism',
  'root vegetables': 'Organism',
  'corvus (genus)': 'Organism',
  'insects in culture': 'Organism',
  ducks: 'Organism',
  agamidae: 'Organism',
  'edge species': 'Organism',
  'tropical fruit': 'Organism',
  pinus: 'Organism',
  'tropical agriculture': 'Organism',
  'indian spices': 'Organism',
  'paleocene genus extinctions': 'Organism',
  'epiphytic orchids': 'Organism',
  crops: 'Organism',
  'fruits originating in asia': 'Organism',
  calidris: 'Organism',
  ptilodontoids: 'Organism',
  'plants and pollinators': 'Organism',
  'mammal families': 'Organism',
  'marine edible fish': 'Organism',
  'taxa named by leopold fitzinger': 'Organism',
  setophaga: 'Organism',
  shorebirds: 'Organism',
  berries: 'Organism',
  megafauna: 'Organism',
  'animal dance': 'Organism',
  'animal phyla': 'Organism',
  'american inventions': 'Organism',
  entheogens: 'Organism',
  'crops originating from the americas': 'Organism',
  'non-timber forest products': 'Organism',
  geese: 'Organism',
  // person-musician
  'american male guitarists': 'Person/Artist',
  'american singer-songwriters': 'Person/Artist',
  'american male singers': 'Person/Artist',
  'american rock singers': 'Person/Artist',
  'american rock guitarists': 'Person/Artist',
  '21st-century american singers': 'Person/Artist',
  'lead guitarists': 'Person/Artist',
  'african-american musicians': 'Person/Artist',
  'english male singers': 'Person/Artist',
  'american male singer-songwriters': 'Person/Artist',
  'american rock songwriters': 'Person/Artist',
  'american record producers': 'Person/Artist',
  'american country singer-songwriters': 'Person/Artist',
  '20th-century american guitarists': 'Person/Artist',
  'english songwriters': 'Person/Artist',
  '20th-century american pianists': 'Person/Artist',
  'songwriters from new york (state)': 'Person/Artist',
  'african-american singers': 'Person/Artist',
  'american blues singers': 'Person/Artist',
  'american pop singers': 'Person/Artist',
  'male guitarists': 'Person/Artist',
  'american country singers': 'Person/Artist',
  'blues hall of fame inductees': 'Person/Artist',
  'american male songwriters': 'Person/Artist',
  'songwriters from california': 'Person/Artist',
  'english rock guitarists': 'Person/Artist',
  'american folk singers': 'Person/Artist',
  'english rock singers': 'Person/Artist',
  'english singer-songwriters': 'Person/Artist',
  'african-american male rappers': 'Person/Artist',
  'african-american jazz musicians': 'Person/Artist',
  '20th-century english singers': 'Person/Artist',
  'american female singer-songwriters': 'Person/Artist',
  'jewish american musicians': 'Person/Artist',
  'american blues guitarists': 'Person/Artist',
  '20th-century conductors (music)': 'Person/Artist',
  'american female singers': 'Person/Artist',
  'american jazz bandleaders': 'Person/Artist',
  'american jazz pianists': 'Person/Artist',
  'american soul singers': 'Person/Artist',
  'american female guitarists': 'Person/Artist',
  'american multi-instrumentalists': 'Person/Artist',
  'american country guitarists': 'Person/Artist',
  'english record producers': 'Person/Artist',
  'songwriters from texas': 'Person/Artist',
  'american composers': 'Person/Artist',
  'singers from california': 'Person/Artist',
  'american folk guitarists': 'Person/Artist',
  'lgbt singers': 'Person/Artist',
  'american buskers': 'Person/Artist',
  'guitarists from california': 'Person/Artist',
  'feminist musicians': 'Person/Artist',
  'big band bandleaders': 'Person/Artist',
  '20th-century composers': 'Person/Artist',
  'african-american songwriters': 'Person/Artist',
  'british rhythm and blues boom musicians': 'Person/Artist',
  'alternative rock singers': 'Person/Artist',
  '21st-century american guitarists': 'Person/Artist',
  'american alternative rock musicians': 'Person/Artist',
  'musicians from los angeles': 'Person/Artist',
  'rhythm guitarists': 'Person/Artist',
  'american session musicians': 'Person/Artist',
  'jazz musicians from new orleans': 'Person/Artist',
  'alternative rock guitarists': 'Person/Artist',
  '20th-century women musicians': 'Person/Artist',
  'male film score composers': 'Person/Artist',
  'african-american singer-songwriters': 'Person/Artist',
  'american jazz singers': 'Person/Artist',
  '21st-century english singers': 'Person/Artist',
  'singers from new york city': 'Person/Artist',
  'american acoustic guitarists': 'Person/Artist',
  'musicians from new york city': 'Person/Artist',
  'slide guitarists': 'Person/Artist',
  'guitarists from texas': 'Person/Artist',
  // org
  'companies listed on the new york stock exchange': 'Organization/Company',
  'football clubs in england': 'Organization/SportsTeam',
  'musical quintets': 'Organization/MusicalGroup',
  'english rock music groups': 'Organization/MusicalGroup',
  'english new wave musical groups': 'Organization/MusicalGroup',
  'jazz record labels': 'Organization/Company',
  'video game development companies': 'Organization/Company',
  'american record labels': 'Organization/Company',
  'english football league clubs': 'Organization/SportsTeam',
  'companies listed on nasdaq': 'Organization/Company',
  'african-american musical groups': 'Organization/MusicalGroup',
  'japanese brands': 'Organization',
  'video game companies of the united states': 'Organization/Company',
  'american jazz composers': 'Organization',
  '21st-century american musicians': 'Organization/MusicalGroup',
  'companies formerly listed on the london stock exchange': 'Organization/Company',
  'southern football league clubs': 'Organization/SportsTeam',
  'multinational companies headquartered in the united states': 'Organization/Company',
  'scouting in the united states': 'Organization',
  'car brands': 'Organization',
  'american alternative metal musical groups': 'Organization/MusicalGroup',
  'government-owned airlines': 'Organization',
  'football clubs in scotland': 'Organization/SportsTeam',
  'baptist denominations in north america': 'Organization',
  'baptist denominations established in the 20th century': 'Organization',
  'land-grant universities and colleges': 'Organization',
  'companies listed on the tokyo stock exchange': 'Organization/Company',
  'organizations based in washington, d.c.': 'Organization',
  'premier league clubs': 'Organization/SportsTeam',
  'national basketball association teams': 'Organization/SportsTeam',
  'social democratic parties': 'Organization/PoliticalParty',
  're-established companies': 'Organization/Company',
  'video game publishers': 'Organization',
  'companies based in new york city': 'Organization/Company',
  'defunct video game companies': 'Organization/Company',
  'companies formed by merger': 'Organization/Company',
  'english pop music groups': 'Organization/MusicalGroup',
  'defunct motor vehicle manufacturers of the united states': 'Organization',
  'alternative rock groups from california': 'Organization',
  'entertainment companies based in california': 'Organization/Company',
  'art rock musical groups': 'Organization/MusicalGroup',
  'english post-punk music groups': 'Organization/MusicalGroup',
  // learned people
  'year of birth unknown': 'Person',
  'fellows of the royal society': 'Person',
  'members of the privy council of the united kingdom': 'Person',
  'uk mps 2001–05': 'Person/Politician',
  'uk mps 1997–2001': 'Person/Politician',
  '20th-century american novelists': 'Person/Artist',
  'american people of english descent': 'Person',
  'american male novelists': 'Person/Artist',
  'uk mps 2005–10': 'Person/Politician',
  'guggenheim fellows': 'Person',
  '20th-century american writers': 'Person',
  'harvard university alumni': 'Person',
  'fellows of the american academy of arts and sciences': 'Person/Academic',
  'american military personnel of world war ii': 'Person',
  '19th-century male writers': 'Person',
  'knights bachelor': 'Person',
  'american roman catholics': 'Person',
  'uk mps 1992–97': 'Person/Politician',
  'american male writers': 'Person',
  'roman catholic monarchs': 'Person/ReligiousFigure',
  '20th-century women writers': 'Person',
  'labour party (uk) mps for english constituencies': 'Person/Politician',
  '20th-century male writers': 'Person',
  'german male writers': 'Person',
  'knights of the garter': 'Person',
  'conservative party (uk) mps for english constituencies': 'Person/Politician',
  'presidential medal of freedom recipients': 'Person',
  'uk mps 1987–92': 'Person/Politician',
  'american film directors': 'Person/Artist',
  '21st-century american novelists': 'Person/Artist',
  'uk mps 2010–15': 'Person/Politician',
  'american film producers': 'Person/Artist',
  'members of the united states national academy of sciences': 'Person/Academic',
  'commanders of the order of the british empire': 'Person',
  'democratic party members of the united states house of representatives': 'Person/Politician',
  'people educated at eton college': 'Person',
  'american male screenwriters': 'Person/Artist',
  '21st-century american writers': 'Person',
  'republican party members of the united states house of representatives': 'Person/Politician',
  popes: 'Person/ReligiousFigure',
  'alumni of trinity college, cambridge': 'Person',
  'french male writers': 'Person',
  'foreign members of the royal society': 'Person',
  'american science fiction writers': 'Person/Artist',
  'american people of scottish descent': 'Person',
  'american memoirists': 'Person',
  'members of the french academy of sciences': 'Person',
  'jewish american writers': 'Person',
  '20th-century english novelists': 'Person/Artist',
  'uk mps 1983–87': 'Person/Politician',
  'united states army soldiers': 'Person',
  'officers of the order of the british empire': 'Person',
  'deaths from pneumonia': 'Person',
  'burials at père lachaise cemetery': 'Person',
  'deaths from cancer in california': 'Person',
  'year of birth missing (living people)': 'Person',
  'democratic party state governors of the united states': 'Person/Politician',
  'english male poets': 'Person/Artist',
  'knights of the golden fleece': 'Person',
  'american male short story writers': 'Person/Artist',
  'columbia university alumni': 'Person',
  'alumni of the university of edinburgh': 'Person',
  'american political writers': 'Person/Artist',
  'california republicans': 'Person/Politician',
  'members of the royal swedish academy of sciences': 'Person/Academic',
  'american people of russian-jewish descent': 'Person',
  '20th-century american short story writers': 'Person/Academic',
  'yale university alumni': 'Person',
  'italian popes': 'Person/ReligiousFigure',
  'american atheists': 'Person',
  'people of the tudor period': 'Person',
  'tony award winners': 'Person',
  'male actors from new york city': 'Person/Actor',
  'british secretaries of state': 'Person/Politician',
  'democratic party united states senators': 'Person/Politician',
  'members of the académie française': 'Person',
  'united states army officers': 'Person',
  'persons of national historic significance (canada)': 'Person',
  'uk mps 2015–17': 'Person/Politician',
  '20th-century american businesspeople': 'Person',
  'american journalists': 'Person',
  'american television producers': 'Person',
  'writers from new york city': 'Person',
  'republican party united states senators': 'Person/Politician',
  'american male journalists': 'Person',
  '21st-century women writers': 'Person',
  'american male comedians': 'Person',
  'american nobel laureates': 'Person/Academic',
  'republican party state governors of the united states': 'Person/Politician',
  'princeton university alumni': 'Person',
  'university of paris alumni': 'Person',
  'american episcopalians': 'Person',
  'american women novelists': 'Person',
  'phi beta kappa members': 'Person',
  '20th-century american poets': 'Person',
  'harvard university faculty': 'Person/Academic',
  'english male novelists': 'Person/Artist',
  'california democrats': 'Person/Politician',
  'uk mps 1979–83': 'Person/Politician',
  'bafta winners (people)': 'Person',
  'english male writers': 'Person',
  'uk mps 2017–': 'Person/Politician',
  "members of the queen's privy council for canada": 'Person',
  'vaudeville performers': 'Person/Artist',
  'american presbyterians': 'Person'
};

var byPattern = function byPattern(str, patterns) {
  var types = Object.keys(patterns);

  for (var i = 0; i < types.length; i++) {
    var key = types[i];

    for (var o = 0; o < patterns[key].length; o++) {
      var reg = patterns[key][o];

      if (reg.test(str) === true) {
        return key;
      }
    }
  }

  return null;
};

var _byPattern = byPattern;

var byCategory = function byCategory(doc) {
  var found = [];
  var cats = doc.categories(); // clean them up a bit

  cats = cats.map(function (cat) {
    cat = cat.toLowerCase();
    cat = cat.replace(/^(category|categorie|kategori): ?/i, '');
    cat = cat.replace(/_/g, ' ');
    return cat.trim();
  }); // loop through each

  for (var i = 0; i < cats.length; i++) {
    var cat = cats[i]; // try our 1-to-1 mapping

    if (mapping$1.hasOwnProperty(cat)) {
      found.push({
        cat: mapping$1[cat],
        reason: cat
      });
      continue;
    } // loop through our patterns


    var match = _byPattern(cat, patterns_1);

    if (match) {
      found.push({
        cat: match,
        reason: cat
      });
    }
  }

  return found;
};

var byCategory_1 = byCategory;

var patterns$1 = {
  'Person/Actor': [/actor-stub$/],
  'Person/Politician': [/(politician|mayor)-stub$/],
  'Person/Artist': [/(artist|musician|singer)-stub$/],
  'Person/Athlete': [/sport-bio-stub$/],
  Person: [/-bio-stub$/],
  'CreativeWork/Book': [/-novel-stub$/],
  'CreativeWork/Film': [/-film-stub$/],
  'CreativeWork/Album': [/-album-stub$/],
  'CreativeWork/Play': [/-play-stub$/],
  CreativeWork: [/-song-stub$/],
  'Event/Election': [/-election-stub$/],
  'Organization/SportsTeam': [/-sport-team-stub$/],
  'Organization/Company': [/-company-stub$/],
  'Place/BodyOfWater': [/-river-stub$/],
  Place: [/-geo-stub$/]
};

var mapping$2 = {
  //place
  coord: 'Place',
  'weather box': 'Place',
  //person
  persondata: 'Person',
  writer: 'Person',
  'ted speaker': 'Person',
  taxonbar: 'Organism',
  wikispecies: 'Organism',
  animalia: 'Organism',
  chordata: 'Organism',
  cnidaria: 'Organism',
  porifera: 'Organism',
  epicaridea: 'Organism',
  mammals: 'Organism',
  phlyctaeniidae: 'Organism',
  carnivora: 'Organism',
  clade: 'Organism',
  'life on earth': 'Organism',
  'orders of insects': 'Organism',
  coleoptera: 'Organism',
  'insects in culture': 'Organism',
  'living things in culture': 'Organism',
  'eukaryota classification': 'Organism',
  // creative work
  rating: 'CreativeWork',
  'certification table entry': 'CreativeWork',
  'imdb title': 'CreativeWork/Film',
  'track listing': 'CreativeWork/Album',
  albumchart: 'CreativeWork',
  'film date': 'CreativeWork/Film',
  music: 'CreativeWork',
  // vgrelease: 'CreativeWork',
  // chem: 'CreativeWork',
  'album ratings': 'CreativeWork',
  tracklist: 'CreativeWork/Album',
  'episode list': 'CreativeWork/TVShow',
  'album chart': 'CreativeWork',
  'rotten-tomatoes': 'CreativeWork/Film',
  singles: 'CreativeWork',
  isbnt: 'CreativeWork',
  singlechart: 'CreativeWork',
  'tcmdb title': 'CreativeWork',
  'mojo title': 'CreativeWork',
  'based on': 'CreativeWork',
  'amg movie': 'CreativeWork',
  duration: 'CreativeWork',
  // learned events
  esc: 'Event',
  'year nav': 'Event',
  'year dab': 'Event',
  goal: 'Event',
  flagiocmedalist: 'Event',
  'm1 year in topic': 'Event',
  'year nav topic5': 'Event',
  'bc year in topic': 'Event',
  flagiocathlete: 'Event',
  'election summary party with leaders': 'Event/Election',
  'year article header': 'Event',
  //learned organisms
  'iucn status': 'Organism',
  extinct: 'Organism',
  'fossil range': 'Organism',
  internetbirdcollection: 'Organism',
  vireo: 'Organism',
  'angle bracket': 'Organism',
  'wikispecies-inline': 'Organism',
  'iucn map': 'Organism',
  'xeno-canto species': 'Organism',
  avibase: 'Organism',
  cladex: 'Organism',
  birdlife: 'Organism',
  fossilrange: 'Organism',
  //leaned orgs
  'composition bar': 'Organization',
  'fs player': 'Organization',
  y: 'Organization',
  n: 'Organization',
  rws: 'Organization',
  allmusic: 'Organization/MusicalGroup',
  // learned people
  's-aft': 'Person',
  's-bef': 'Person',
  's-start': 'Person',
  marriage: 'Person',
  'list of united states senators congress': 'Person/Politician',
  's-off': 'Person',
  's-par': 'Person',
  'internet archive author': 'Person',
  'ribbon devices': 'Person',
  's-reg': 'Person',
  'find a grave': 'Person',
  'gutenberg author': 'Person',
  's-new': 'Person',
  'other people': 'Person',
  medalgold: 'Person',
  'baseball year': 'Person/Athlete',
  medal: 'Person',
  // 'post-nominals': 'Person',
  mlby: 'Person',
  's-vac': 'Person',
  's-hou': 'Person',
  'librivox author': 'Person',
  'blp sources': 'Person',
  's-ppo': 'Person',
  nbay: 'Person',
  //learned places
  'us census population': 'Place',
  jct: 'Place',
  'geographic location': 'Place',
  // wikivoyage: 'Place',
  representative: 'Place',
  'historical populations': 'Place',
  'wikivoyage-inline': 'Place',
  'election box': 'Place',
  zh: 'Place',
  'wide image': 'Place'
};

var byTemplate = function byTemplate(doc) {
  var templates = doc.templates();
  var found = [];

  for (var i = 0; i < templates.length; i++) {
    var title = templates[i].template;

    if (mapping$2.hasOwnProperty(title)) {
      found.push({
        cat: mapping$2[title],
        reason: title
      });
    } else {
      // try regex-list on it
      var type = _byPattern(title, patterns$1);

      if (type) {
        found.push({
          cat: type,
          reason: title
        });
      }
    }
  }

  return found;
};

var byTemplate_1 = byTemplate;

var mapping$3 = {
  // person
  'early life': 'Person',
  'personal life': 'Person',
  career: 'Person',
  'career statistics': 'Person',
  'playing career': 'Person',
  'life and career': 'Person',
  'early life and education': 'Person',
  'film and television credits': 'Person',
  filmography: 'Person',
  'selected filmography': 'Person',
  // place
  demographics: 'Place',
  neighbourhoods: 'Place',
  climate: 'Place',
  'sister cities': 'Place/City',
  'notable people': 'Place',
  // creative-work
  cast: 'CreativeWork/Film',
  plot: 'CreativeWork',
  reception: 'CreativeWork',
  // 'critical reception': 'CreativeWork',
  // 'critical response': 'CreativeWork',
  'track listing': 'CreativeWork/Album',
  // org
  founding: 'Organization',
  founders: 'Organization',
  'coaching staff': 'Organization/SportsTeam',
  'head coaches': 'Organization/SportsTeam',
  'team records': 'Organization/SportsTeam',
  'band members': 'Organization/MusicalGroup',
  habitat: 'Organism',
  morphology: 'Organism',
  phylogeny: 'Organism',
  'distribution and diversity': 'Organism',
  'distribution and habitat': 'Organism',
  'reproduction and development': 'Organism',
  'taxonomy and phylogeny': 'Organism',
  // march 29th
  //learned works
  // production: 'CreativeWork',
  charts: 'CreativeWork',
  release: 'CreativeWork',
  'plot summary': 'CreativeWork',
  gameplay: 'CreativeWork',
  characters: 'CreativeWork',
  'box office': 'CreativeWork',
  accolades: 'CreativeWork',
  soundtrack: 'CreativeWork',
  adaptations: 'CreativeWork',
  synopsis: 'CreativeWork',
  'home media': 'CreativeWork',
  'weekly charts': 'CreativeWork',
  themes: 'CreativeWork',
  'publication history': 'CreativeWork',
  filming: 'CreativeWork',
  'year-end charts': 'CreativeWork',
  casting: 'CreativeWork',
  'release and reception': 'CreativeWork',
  'commercial performance': 'CreativeWork',
  composition: 'CreativeWork',
  album: 'CreativeWork',
  setting: 'CreativeWork',
  'chart positions': 'CreativeWork',
  'release history': 'CreativeWork',
  'charts and certifications': 'CreativeWork',
  sequels: 'CreativeWork',
  'chart performance': 'CreativeWork',
  sequel: 'CreativeWork',
  recordings: 'CreativeWork',
  story: 'CreativeWork',
  editions: 'CreativeWork',
  'in other media': 'CreativeWork',
  // learned events
  aftermath: 'Event',
  births: 'Event',
  deaths: 'Event',
  battle: 'Event',
  results: 'Event',
  prelude: 'Event',
  may: 'Event',
  june: 'Event',
  march: 'Event',
  december: 'Event',
  october: 'Event',
  july: 'Event',
  august: 'Event',
  april: 'Event',
  november: 'Event',
  february: 'Event',
  september: 'Event',
  january: 'Event',
  incumbents: 'Event',
  casualties: 'Event',
  'july to december': 'Event',
  'january to june': 'Event',
  'medal table': 'Event',
  'mission highlights': 'Event/SpaceMission',
  campaign: 'Event',
  // learned orgs
  albums: 'Organization/MusicalGroup',
  'studio albums': 'Organization/MusicalGroup',
  members: 'Organization',
  athletics: 'Organization',
  'notable alumni': 'Organization',
  academics: 'Organization',
  campus: 'Organization',
  organization: 'Organization',
  'student life': 'Organization',
  rankings: 'Organization',
  'compilation albums': 'Organization/MusicalGroup',
  // origins: 'Organization',
  'live albums': 'Organization/MusicalGroup',
  products: 'Organization/Company',
  fleet: 'Organization',
  compilations: 'Organization/MusicalGroup',
  research: 'Organization',
  formation: 'Organization',
  operations: 'Organization',
  'current squad': 'Organization/SportsTeam',
  players: 'Organization',
  alumni: 'Organization',
  eps: 'Organization/MusicalGroup',
  'former members': 'Organization',
  presidents: 'Organization',
  membership: 'Organization',
  'current members': 'Organization',
  // learned people
  works: 'Person',
  life: 'Person',
  family: 'Person',
  'political career': 'Person',
  'early career': 'Person',
  // ancestry: 'Person',
  'later life': 'Person',
  'early life and career': 'Person',
  'later years': 'Person',
  'death and legacy': 'Person',
  work: 'Person',
  novels: 'Person',
  'later career': 'Person',
  international: 'Person',
  'selected works': 'Person',
  writings: 'Person',
  'professional career': 'Person',
  retirement: 'Person',
  poetry: 'Person',
  marriage: 'Person',
  // films: 'Person',
  'electoral history': 'Person',
  'military career': 'Person',
  'international career': 'Person',
  'parliamentary career': 'Person',
  // learned places
  geography: 'Place',
  '2010 census': 'Place',
  '2000 census': 'Place',
  economy: 'Place',
  transportation: 'Place',
  government: 'Place',
  communities: 'Place',
  transport: 'Place',
  culture: 'Place',
  sports: 'Place',
  'adjacent counties': 'Place',
  'major highways': 'Place',
  'notable residents': 'Place',
  tourism: 'Place',
  cities: 'Place',
  population: 'Place',
  'unincorporated communities': 'Place',
  'international relations': 'Place',
  infrastructure: 'Place',
  schools: 'Place',
  rail: 'Place',
  'census-designated places': 'Place',
  towns: 'Place',
  'local government': 'Place',
  'points of interest': 'Place',
  attractions: 'Place',
  geology: 'Place',
  townships: 'Place',
  recreation: 'Place',
  location: 'Place',
  'arts and culture': 'Place',
  governance: 'Place',
  'administrative divisions': 'Place',
  landmarks: 'Place',
  demography: 'Place',
  'parks and recreation': 'Place',
  'public transportation': 'Place',
  'coat of arms': 'Place',
  churches: 'Place' // learned things
  //compatibility: 'Thing',
  //compliance: 'Thing',
  //'key features': 'Thing'

};

var fromSection = function fromSection(doc) {
  var found = [];
  var titles = doc.sections().map(function (s) {
    var str = s.title();
    str = str.toLowerCase().trim();
    return str;
  });

  for (var i = 0; i < titles.length; i++) {
    var title = titles[i];

    if (mapping$3.hasOwnProperty(title)) {
      found.push({
        cat: mapping$3[title],
        reason: title
      });
    }
  }

  return found;
};

var bySection = fromSection;

var mapping$4 = {
  'american football player': 'Person/Athlete',
  'australian politician': 'Person/Politician',
  'canadian politician': 'Person/Politician',
  'cape verde': 'Place',
  'cedar busway station': 'Place',
  'computer game': 'Product',
  'delhi metro': 'Place',
  'erie county, new york': 'Place',
  'football player': 'Person/Athlete',
  'gaelic footballer': 'Person/Athlete',
  'murder victim': 'Person',
  'new jersey': 'Place',
  'new orleans': 'Place',
  'new york City Subway': 'Place',
  'new york': 'Place',
  'new zealand': 'Place',
  'north carolina': 'Place',
  'northern ireland': 'Place',
  'season 2': 'CreativeWork',
  'season 3': 'CreativeWork',
  'season 4': 'CreativeWork',
  'season 5': 'CreativeWork',
  'sri lanka': 'Place',
  'the twilight zone': 'CreativeWork',
  'tv series': 'CreativeWork/TVShow',
  'uk parliament constituency': 'Place',
  'united kingdom': 'Place',
  'united states': 'Place',
  'video game': 'CreativeWork/VideoGame',
  academic: 'Person',
  actor: 'Person/Actor',
  actress: 'Person/Actor',
  alaska: 'Place',
  album: 'CreativeWork/Album',
  argentina: 'Place',
  arkansas: 'Place',
  artist: 'Person/Artist',
  athlete: 'Person/Athlete',
  australia: 'Place',
  author: 'Person',
  ballet: 'CreativeWork',
  band: 'Organization/MusicalGroup',
  barbados: 'Place',
  bishop: 'Person/ReligiousFigure',
  book: 'CreativeWork/Book',
  boxer: 'Person/Athlete',
  brazil: 'Place',
  businessman: 'Person',
  california: 'Place',
  canada: 'Place',
  candy: 'Product',
  chad: 'Place',
  character: 'FictionalCharacter',
  chicago: 'Place',
  // cocktail: 'Thing',
  colombia: 'Place',
  company: 'Organization/Company',
  composer: 'Person/Artist',
  connecticut: 'Place',
  cricketer: 'Person/Athlete',
  cyclist: 'Person',
  diplomat: 'Person',
  director: 'Person',
  dominica: 'Place',
  // drink: 'Thing',
  drummer: 'Person',
  edmonton: 'Place',
  footballer: 'Person/Athlete',
  france: 'Place',
  // game: 'Thing',
  georgia: 'Place',
  group: 'Organization',
  // horse: 'Thing',
  india: 'Place',
  israel: 'Place',
  japan: 'Place',
  journal: 'Organization',
  journalist: 'Person',
  judge: 'Person',
  magazine: 'CreativeWork',
  manhattan: 'Place',
  michigan: 'Place',
  miniseries: 'CreativeWork',
  minister: 'Person',
  movie: 'CreativeWork/Film',
  music: 'CreativeWork',
  musician: 'Person/Artist',
  newspaper: 'Organization/Company',
  nigeria: 'Place',
  novel: 'CreativeWork/Book',
  oklahoma: 'Place',
  ontario: 'Place',
  opera: 'CreativeWork',
  painter: 'Person/Artist',
  painting: 'CreativeWork',
  pennsylvania: 'Place',
  plant: 'Organism',
  play: 'CreativeWork/Play',
  poet: 'Person',
  politician: 'Person/Politician',
  portugal: 'Place',
  priest: 'Person',
  province: 'Place',
  rapper: 'Person/Artist',
  river: 'Place/BodyOfWater',
  series: 'CreativeWork',
  //  ship: 'Thing',
  singer: 'Person/Artist',
  single: 'CreativeWork',
  // software: 'Thing/Software',
  song: 'CreativeWork',
  soundtrack: 'CreativeWork',
  spain: 'Place',
  sudan: 'Place',
  texas: 'Place',
  //  train: 'Thing',
  uk: 'Place',
  va: 'Place',
  Virginia: 'Place',
  volcano: 'Place',
  washington: 'Place',
  wrestler: 'Person/Athlete',
  //March 29
  //learned works
  ep: 'CreativeWork',
  comics: 'CreativeWork',
  musical: 'CreativeWork',
  manga: 'CreativeWork',
  'star trek: the next generation': 'CreativeWork',
  'star trek: deep space nine': 'CreativeWork',
  'buffy the vampire slayer': 'CreativeWork',
  angel: 'CreativeWork',
  'the outer limits': 'CreativeWork',
  'star trek: voyager': 'CreativeWork',
  'short story': 'CreativeWork',
  seinfeld: 'CreativeWork',
  'star trek: enterprise': 'CreativeWork',
  poem: 'CreativeWork',
  tv: 'CreativeWork',
  'uk series': 'CreativeWork',
  'doctor who': 'CreativeWork',
  'david bowie song': 'CreativeWork',
  caravaggio: 'CreativeWork',
  'the beach boys song': 'CreativeWork',
  video: 'CreativeWork',
  'audio drama': 'CreativeWork',
  'babylon 5': 'CreativeWork',
  'madonna song': 'CreativeWork',
  'game show': 'CreativeWork/TVShow',
  'u.s. tv series': 'CreativeWork/TVShow',
  'uk tv series': 'CreativeWork/TVShow',
  'australian tv series': 'CreativeWork/TVShow',
  'u.s. game show': 'CreativeWork/TVShow',
  //learned events
  festival: 'Event',
  '25 m': 'Event',
  'world war ii': 'Event',
  conmebol: 'Event',
  'music festival': 'Event',
  'world war i': 'Event',
  //learned orgs
  am: 'Organization',
  fm: 'Organization',
  'american band': 'Organization/MusicalGroup',
  wehrmacht: 'Organization',
  'tv channel': 'Organization',
  'british band': 'Organization',
  organization: 'Organization',
  airline: 'Organization',
  publisher: 'Organization',
  'australian band': 'Organization/MusicalGroup',
  'canadian band': 'Organization/MusicalGroup',
  restaurant: 'Organization/Company',
  brand: 'Organization',
  'uk band': 'Organization/MusicalGroup',
  'record label': 'Organization',
  retailer: 'Organization/Company',
  'union army': 'Organization',
  store: 'Organization/Company',
  defunct: 'Organization',
  'tv network': 'Organization',
  'political party': 'Organization/PoliticalParty',
  'japanese band': 'Organization/MusicalGroup',
  'department store': 'Organization',
  'swedish band': 'Organization/MusicalGroup',
  //learned people
  'american football': 'Person',
  'ice hockey': 'Person',
  soccer: 'Person',
  'rugby league': 'Person',
  'rugby union': 'Person',
  'field hockey': 'Person',
  tennis: 'Person',
  writer: 'Person',
  vc: 'Person',
  'racing driver': 'Person',
  'british politician': 'Person/Politician',
  golfer: 'Person/Athlete',
  historian: 'Person/Academic',
  architect: 'Person',
  comedian: 'Person',
  cartoonist: 'Person/Artist',
  governor: 'Person/Politician',
  'british army officer': 'Person',
  general: 'Person',
  broadcaster: 'Person',
  engineer: 'Person',
  philosopher: 'Person/Academic',
  mathematician: 'Person/Academic',
  novelist: 'Person/Artist',
  physician: 'Person',
  swimmer: 'Person/Athlete',
  soldier: 'Person',
  photographer: 'Person/Artist',
  'royal navy officer': 'Person',
  producer: 'Person',
  theologian: 'Person/ReligiousFigure',
  lawyer: 'Person',
  playwright: 'Person/Artist',
  activist: 'Person',
  inventor: 'Person',
  astronomer: 'Person/Academic',
  'irish politician': 'Person/Politician',
  economist: 'Person/Academic',
  mayor: 'Person/Politician',
  moon: 'Place/SpaceLocation',
  country: 'Place/Country',
  // learned things
  // 'programming language': 'Thing/Software',
  genus: 'Organism',
  //  missile: 'Thing',
  'board game': 'Product',
  //  'new york city subway car': 'Thing',
  //  instrument: 'Thing',
  //  food: 'Thing',
  fish: 'Organism',
  bird: 'Organism',
  // 'operating system': 'Thing/Software',
  //  'file format': 'Thing',
  // 'computer virus': 'Thing/Software',
  'card game': 'Product',
  automobile: 'Product' //  rocket: 'Thing'
  // website: 'Thing/Software'

};

var patterns$2 = {
  'CreativeWork/Film': [/ \([0-9]{4} film\)$/],
  CreativeWork: [/ \((.*? )song\)$/],
  Event: [/ \((19|20)[0-9]{2}\)$/]
};

var paren = /\((.*)\)$/;

var byTitle = function byTitle(doc) {
  var title = doc.title();

  if (!title) {
    return [];
  } //look at parentheses like 'Tornado (film)'


  var m = title.match(paren);

  if (!m) {
    return [];
  }

  var inside = m[1] || '';
  inside = inside.toLowerCase();
  inside = inside.replace(/_/g, ' ');
  inside = inside.trim(); //look at known parentheses

  if (mapping$4.hasOwnProperty(inside)) {
    return [{
      cat: mapping$4[inside],
      reason: inside
    }];
  } // look at regex


  var match = _byPattern(title, patterns$2);

  if (match) {
    return [{
      cat: match,
      reason: title
    }];
  }

  return [];
};

var byTitle_1 = byTitle;

var byDescription = function byDescription(doc) {
  var tmpl = doc.template('short description');

  if (tmpl && tmpl.description) {
    var desc = tmpl.description; // person

    if (desc.match(/(actor|actress)/)) {
      return [{
        cat: 'Person/Actor',
        reason: desc
      }];
    }

    if (desc.match(/(artist|singer|musician|painter|poet|rapper|drummer)/)) {
      return [{
        cat: 'Person/Artist',
        reason: desc
      }];
    }

    if (desc.match(/(keyboard|guitar|bass) player/)) {
      return [{
        cat: 'Person/Artist',
        reason: desc
      }];
    }

    if (desc.match(/(politician|member of parliament)/)) {
      return [{
        cat: 'Person/Politician',
        reason: desc
      }];
    }

    if (desc.match(/(hockey|soccer|backetball|football) player/)) {
      return [{
        cat: 'Person/Athlete',
        reason: desc
      }];
    }

    if (desc.match(/(writer|celebrity|activist)/)) {
      return [{
        cat: 'Person',
        reason: desc
      }];
    } // organizations


    if (desc.match(/(basketball|hockey|soccer|football|sports) team/)) {
      return [{
        cat: 'Organization/SportsTeam',
        reason: desc
      }];
    }

    if (desc.match(/(company|subsidary)/)) {
      return [{
        cat: 'Organization/Company',
        reason: desc
      }];
    }

    if (desc.match(/political party/)) {
      return [{
        cat: 'Organization/PoliticalParty',
        reason: desc
      }];
    }

    if (desc.match(/(charity|organization|ngo)/)) {
      return [{
        cat: 'Organization',
        reason: desc
      }];
    } // creativeworks


    if (desc.match(/television series/)) {
      return [{
        cat: 'CreativeWork/TVShow',
        reason: desc
      }];
    }

    if (desc.match(/[0-9]{4} film/)) {
      return [{
        cat: 'CreativeWork/Film',
        reason: desc
      }];
    }

    console.log(desc);
  }

  return [];
};

var byDescription_1 = byDescription;

var skip = {
  disambiguation: true,
  surname: true,
  name: true,
  'given name': true
};
var paren$1 = /\((.*)\)$/;
var listOf = /^list of ./;
var disambig = /\(disambiguation\)/;

var skipPage = function skipPage(doc) {
  var title = doc.title() || ''; //look at parentheses like 'Tornado (film)'

  var m = title.match(paren$1);

  if (!m) {
    return null;
  }

  var inside = m[1] || '';
  inside = inside.toLowerCase();
  inside = inside.replace(/_/g, ' ');
  inside = inside.trim(); //look at known parentheses

  if (skip.hasOwnProperty(inside)) {
    return true;
  } //try a regex


  if (listOf.test(title) === true) {
    return true;
  }

  if (disambig.test(title) === true) {
    return true;
  }

  return false;
};

var _skip = skipPage;

var tree = {
  Person: {
    Athlete: true,
    Artist: true,
    Politician: true,
    Actor: true,
    Academic: true,
    ReligiousFigure: true
  },
  Place: {
    Country: true,
    City: true,
    Structure: true,
    BodyOfWater: true,
    SpaceLocation: true
  },
  Organization: {
    Company: true,
    SportsTeam: true,
    MusicalGroup: true,
    PoliticalParty: true
  },
  CreativeWork: {
    Film: true,
    TVShow: true,
    Play: true,
    Book: true,
    Album: true,
    VideoGame: true
  },
  Event: {
    Election: true,
    Disaster: true,
    SportsEvent: true,
    MilitaryConflict: true,
    SpaceMission: true
  },
  Product: true,
  Organism: true,
  MedicalCondition: true,
  Concept: true,
  FictionalCharacter: true
};

var isObject = function isObject(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]';
};

var types = {};

var doit = function doit(type, obj) {
  Object.keys(obj).forEach(function (k) {
    var tmp = k;

    if (type) {
      tmp = type + '/' + k;
    }

    types[tmp] = true;

    if (isObject(tree[k])) {
      doit(tmp, tree[k]);
    }
  });
};

doit('', tree);
var _types = types;

var topk = function topk(arr) {
  var obj = {};
  arr.forEach(function (a) {
    obj[a] = obj[a] || 0;
    obj[a] += 1;
  });
  var res = Object.keys(obj).map(function (k) {
    return [k, obj[k]];
  });
  res = res.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1;
    } else if (a[1] < b[1]) {
      return 1;
    }

    return 0;
  });
  return res;
};

var parse = function parse(cat) {
  var split = cat.split(/\//);
  return {
    root: split[0],
    child: split[1]
  };
};

var getScore = function getScore(detail) {
  var cats = [];
  Object.keys(detail).forEach(function (k) {
    detail[k].forEach(function (obj) {
      if (!_types[obj.cat]) {
        console.error('Missing: ' + obj.cat);
      }

      cats.push(parse(obj.cat));
    });
  }); // find top parent

  var roots = cats.map(function (obj) {
    return obj.root;
  }).filter(function (s) {
    return s;
  });
  var tops = topk(roots);
  var top = tops[0];

  if (!top) {
    return {
      detail: detail,
      category: null,
      score: 0
    };
  }

  var root = top[0]; // score as % of results

  var score = top[1] / cats.length; // punish low counts

  if (top[1] === 1) {
    score *= 0.75;
  }

  if (top[1] === 2) {
    score *= 0.85;
  }

  if (top[1] === 3) {
    score *= 0.95;
  } // if the second root is good


  if (tops[1]) {
    if (tops[1][1] === tops[0][1]) {
      score *= 0.5; //tie
    } else {
      score *= 0.8;
    }
  } // find 2nd level


  var children = cats.filter(function (o) {
    return o.root === root && o.child;
  }).map(function (obj) {
    return obj.child;
  });
  var topKids = topk(children);
  top = topKids[0];
  var category = root;

  if (top) {
    category = "".concat(root, "/").concat(top[0]); // punish for any conflicting children

    if (topKids.length > 1) {
      score *= 0.7;
    } // punish for low count


    if (top[1] === 1) {
      score *= 0.8;
    }
  }

  return {
    root: root,
    category: category,
    score: score,
    detail: detail
  };
};

var score = getScore;

var plugin = function plugin(models) {
  // add a new method to main class
  models.Doc.prototype.classify = function (options) {
    var doc = this;
    var res = {}; // dont classify these

    if (_skip(doc)) {
      return score(res);
    } //look for 'infobox person', etc


    res.infobox = byInfobox_1(doc); //look for '{{coord}}'

    res.template = byTemplate_1(doc); //look for '==early life=='

    res.section = bySection(doc); //look for 'foo (film)'

    res.title = byTitle_1(doc); //look for 'foo (film)'

    res.description = byDescription_1(doc); //look for 'Category: 1992 Births', etc

    res.category = byCategory_1(doc);
    return score(res);
  };
};

var src = plugin;

export default src;
