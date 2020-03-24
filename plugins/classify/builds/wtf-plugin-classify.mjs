/* wtf-plugin-classify 0.0.1  MIT */
var infoboxes = {
  actor: 'Person',
  //1
  adult_biography: 'Person',
  //2
  afl_biography: 'Person',
  //7
  aircraft_accident: 'Event/Disaster',
  //2
  aircraft_begin: 'Thing',
  //24
  aircraft_engine: 'Thing',
  //2
  aircraft_occurrence: '',
  //5
  aircraft_type: 'Thing',
  //21
  airline: 'Organization',
  //9
  airliner_accident: 'Event/Disaster',
  //3
  airport: 'Place',
  //20
  album: 'CreativeWork/Album',
  //466
  'album/color': '',
  //1
  alpine_ski_racer: 'Person/Athlete',
  //2
  amusement_park: 'Place',
  //4
  ancient_site: 'Place',
  //14
  'animanga/footer': '',
  //21
  'animanga/game': '',
  //2
  'animanga/header': '',
  //21
  'animanga/print': '',
  //12
  'animanga/video': '',
  //23
  antipope: '',
  //1
  archbishop: 'Person',
  //1
  architect: 'Person',
  //9
  artifact: 'Thing',
  //1
  artist: 'Person/Artist',
  //42
  artist_discography: '',
  //9
  artwork: 'CreativeWork',
  //14
  athlete: 'Person/Athlete',
  //6
  athletics_championships: 'Event/SportsEvent',
  //6
  australian_electorate: '',
  //3
  australian_place: 'Place',
  //18
  automobile: 'Thing/Product',
  //8
  award: '',
  //30
  badminton_event: 'Event/SportsEvent',
  //2
  baseball_biography: 'Person/Athlete',
  //64
  basketball_biography: 'Person/Athlete',
  //17
  beauty_pageant: 'Event',
  //4
  beverage: 'Thing/Product',
  //7
  bilateral_relations: '',
  //2
  biodatabase: '',
  //2
  bishopric: '',
  //3
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
  brand: '',
  //1
  bridge: 'Place/Structure',
  //5
  broadcast: 'CreativeWork',
  //10
  broadcasting_network: 'Organization',
  //4
  building: 'Place/Structure',
  //29
  bus_transit: '',
  //5
  canadianmp: 'Person/Politician',
  //18
  canton: '',
  //1
  cardinalstyles: '',
  //2
  casino: 'Place',
  //1
  cave: '',
  //2
  cbb_team: 'Organization',
  //1
  cemetery: 'Place',
  //3
  cfl_player: 'Person/Athlete',
  //2
  character: 'Thing/Character',
  //12
  chef: 'Person',
  //6
  chess_player: 'Person',
  //2
  chinese: '',
  //6
  'chinese-language_singer_and_actor': '',
  //5
  choir: 'Organization',
  //1
  christian_denomination: '',
  //6
  christian_leader: 'Person',
  //17
  church: 'Place',
  //10
  civil_conflict: 'Event',
  //3
  coa_wide: '',
  //3
  coin: '',
  //4
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
  comics_character: 'Thing/Character',
  //13
  comics_creator: 'Person',
  //10
  comics_set_index: '',
  //1
  comics_story_arc: '',
  //1
  company: 'Organization',
  //150
  computer_hardware_bus: 'Thing',
  //1
  computer_virus: 'Thing/Software',
  //1
  concert_tour: 'Event',
  //8
  constellation: '',
  //5
  country_at_games: '',
  //6
  court_case: 'Event',
  //8
  cpu: 'Thing/Product',
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
  'd&d_creature': '',
  //3
  dam: 'Place',
  //4
  data_structure: '',
  //1
  deity: '',
  //5
  disease: '',
  //2
  doctor_who_episode: 'CreativeWork',
  //3
  'dot-com_company': 'Organization',
  //3
  drug_class: '',
  //1
  earthquake: 'Event/Disaster',
  //2
  economist: 'Person',
  //4
  economy: '',
  //4
  election: 'Event/Election',
  //19
  electric_vehicle: 'Thing/Product',
  //1
  engineer: 'Person',
  //2
  enzyme: 'Thing',
  //19
  ethnic_group: '',
  //16
  event: 'Event',
  //2
  exchange: '',
  //2
  fashion_designer: 'Person',
  //2
  feature_on_mars: 'Place',
  //1
  field_hockey: '',
  //18
  field_hockey_player: 'Person/Athlete',
  //8
  figure_skater: 'Person/Athlete',
  //3
  fila_wrestling_event: 'Event/SportsEvent',
  //1
  file_format: 'Thing',
  //3
  film: 'CreativeWork/Film',
  //183
  film_awards: 'Organization',
  //1
  film_festival: 'Organization',
  //2
  food: 'Thing',
  //3
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
  french_constituency: '',
  //20
  'g.i._joe_character': '',
  //1
  gaa_club: 'Organization',
  //2
  gaa_player: 'Person/Athlete',
  //15
  game: 'Thing',
  //3
  games: '',
  //3
  gene: 'Thing',
  //3
  german_location: 'Place',
  //6
  given_name: '',
  //9
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
  gpu: 'Thing/Product',
  //1
  grappling_hold: '',
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
  horse: '',
  //1
  horseraces: 'Event',
  //8
  horseracing_personality: 'Person',
  //2
  hospital: 'Place',
  //14
  hotel: 'Place',
  //3
  'hurling_all-ireland': '',
  //2
  hurricane: 'Event/Disaster',
  //1
  ice_hockey_player: 'Person/Athlete',
  //15
  indian_politician: 'Person/Politician',
  //1
  individual_snooker_tournament: 'Event',
  //6
  information_appliance: 'Thing',
  //6
  instrument: 'Thing',
  //3
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
  judo_technique: 'Thing',
  //2
  korean_name: '',
  //18
  laboratory: 'Organization',
  //1
  lacrosse_player: 'Person/Athlete',
  //6
  lake: 'Place/BodyOfWater',
  //10
  language: '',
  //24
  language_family: '',
  //5
  launch_pad: 'Place',
  //1
  law_enforcement_agency: 'Organization',
  //1
  legislation: '',
  //6
  legislative_term: 'Event',
  //1
  legislature: 'Organization',
  //3
  lgbt_rights: '',
  //3
  library: 'Organization',
  //9
  ligament: 'Thing',
  //1
  little_league_world_series: 'Event/SportsEvent',
  //5
  magazine: 'CreativeWork',
  //15
  martial_art: 'Thing',
  //2
  martial_artist: 'Person/Athlete',
  //13
  mass_murderer: 'Person',
  //1
  medical_condition: 'Thing',
  //31
  'medical_condition_(new)': '',
  //6
  medical_person: 'Person',
  //5
  military_conflict: 'Event/War',
  //27
  military_installation: '',
  //1
  military_memorial: 'Place',
  //2
  military_person: 'Person',
  //60
  military_structure: 'Place',
  //15
  military_unit: 'Organization',
  //33
  mineral: 'Thing',
  //5
  minister: 'Person',
  //3
  mla: '',
  //1
  mlb_player: 'Person/Athlete',
  //8
  mobile_phone: 'Thing/Product',
  //3
  model: 'Person',
  //2
  monarch: 'Person',
  //23
  monument: 'Place',
  //1
  motorcycle: 'Thing/Product',
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
  music_genre: 'Thing',
  //5
  musical: 'CreativeWork',
  //3
  musical_artist: 'Organization/MusicalGroup',
  //226
  musical_composition: 'CreativeWork',
  //7
  nascar_driver: 'Person',
  //3
  nascar_race_report: '',
  //1
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
  network: 'Thing',
  //3
  networking_protocol: 'Thing',
  //1
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
  'non-profit': 'SportsTeam',
  //6
  nrhp: '',
  //144
  nycs: '',
  //7
  officeholder: 'Person',
  //133
  official_post: '',
  //1
  oil_field: 'Place',
  //1
  opera: 'CreativeWork',
  //3
  organization: 'Organization',
  //41
  os: 'Thing',
  //1
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
  physical_quantity: '',
  //1
  police_officer: 'Person',
  //2
  political_party: 'Organization',
  //25
  politician: 'Person/Politician',
  //34
  'politician_(general)': 'Person/Politician',
  //2
  port: '',
  //5
  power_station: 'Place/Structure',
  //3
  prepared_food: 'Thing',
  //12
  presenter: 'Person',
  //4
  president: 'Person/Politician',
  //1
  prison: 'Place',
  //4
  professional_wrestler: 'Person/Athlete',
  //9
  programming_language: 'Thing',
  //6
  project: '',
  //1
  protein_family: 'Thing',
  //2
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
  rail: '',
  //4
  rail_line: 'Organization',
  //7
  rail_service: 'Organization',
  //6
  rdt: '',
  //2
  reality_music_competition: 'Event',
  //1
  record_label: 'Organization',
  //7
  recurring_event: 'Event',
  //3
  region_symbols: '',
  //1
  religious_biography: 'Person',
  //9
  religious_building: 'Place/Structure',
  //9
  religious_text: 'Thing',
  //1
  restaurant: '',
  //4
  river: 'Place/BodyOfWater',
  //16
  road: 'Place',
  //41
  road_small: 'Place',
  //14
  rocket: 'Thing',
  //3
  rockunit: '',
  //3
  roman_emperor: 'Person/Politician',
  //2
  royal_house: '',
  //1
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
  saint: 'Person',
  //14
  scholar: 'Person',
  //2
  school: 'Place',
  //95
  school_district: 'Organization',
  //10
  scientist: 'Person/Scientist',
  //84
  scotland_council_area: 'Place',
  //2
  scotus_case: '',
  //6
  sea: 'Place/BodyOfWater',
  //3
  settlement: 'Place',
  //642
  sheep_breed: 'Thing',
  //1
  ship_begin: 'Thing',
  //84
  ship_career: 'Thing',
  //141
  ship_characteristics: 'Thing',
  //86
  ship_class_overview: 'Thing',
  //25
  ship_image: 'Thing',
  //84
  shopping_mall: 'Place',
  //9
  single: '',
  //160
  skier: 'Person/Athlete',
  //14
  soap_character: 'Thing/Character',
  //126
  software: 'Thing/Software',
  //25
  software_license: 'THing',
  //1
  song: 'CreativeWork',
  //30
  song_contest: 'Event',
  //3
  song_contest_entry: 'CreativeWork',
  //12
  south_african_subplace_2011: 'Place',
  //1
  spaceflight: 'Event',
  //17
  'spaceflight/dock': 'Event',
  //17
  'spaceflight/ip': 'Event',
  //19
  sport: 'Thing',
  //2
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
  subdivision_type: 'Thing',
  //1
  summit: 'Event',
  //2
  swimmer: 'Person/Athlete',
  //14
  swiss_town: 'Place',
  //36
  symptom: 'Thing',
  //2
  synthesizer: 'Thing/Product',
  //1
  television: 'Thing/Product',
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
  theatre: '',
  //1
  thoroughbred_racehorse: 'Thing',
  //7
  tour_rugby: '',
  //1
  town_at: 'Place',
  //1
  train: 'Thing',
  //2
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
  'u.s._state_symbols': '',
  //4
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
  ukrainian_raion: '',
  //1
  unesco_world_heritage_site: 'Place',
  //3
  unit: '',
  //4
  united_states_federal_proposed_legislation: 'Thing',
  //1
  university: 'Organization',
  //44
  university_of_notre_dame_residence_hall: 'Place',
  //1
  v8_supercar_team: 'Organization',
  //3
  venue: 'Place',
  //6
  vg: '',
  //3
  vg_series: '',
  //4
  video_game: 'CreativeWork',
  //81
  volleyball_biography: 'Person/Athlete',
  //1
  volleyball_player: 'Person/Athlete',
  //4
  waterfall: 'Place',
  //4
  weapon: 'Thing',
  //15
  website: 'Thing/Software',
  //5
  windmill: 'Place',
  //1
  worldscouting: '',
  //2
  wrc_driver: 'Person',
  //1
  wrestling_event: 'Event/SportsEvent',
  //8
  wrestling_promotion: '',
  //1
  writer: 'Person',
  //69
  writing_system: 'Thing',
  //4
  zoo: 'Place',
  //3
  speciesbox: 'Thing/Organism',
  'automatic taxobox': 'Thing/Organism'
};

var byInfobox = function byInfobox(doc) {
  var infoboxes$1 = doc.infoboxes();
  var found = [];

  for (var i = 0; i < infoboxes$1.length; i++) {
    var inf = infoboxes$1[i];
    var type = inf.type();
    type = type.toLowerCase();
    type = type.replace(/^(category|categorie|kategori): ?/i, '');
    type = type.replace(/ /g, '_');
    type = type.trim();

    if (infoboxes.hasOwnProperty(type)) {
      found.push(infoboxes[type]);
    }
  }

  return found;
};

var byInfobox_1 = byInfobox;

var patterns = {
  'Thing/Character': [/(fictional|television) characters/],
  'Thing/Product': [/products introduced in ./, /musical instruments/],
  'Thing/Organism': [/(funghi|reptiles|flora|fauna|fish|birds|trees) of ./, / first appearances/, / phyla/],
  // ==Person==
  'Person/Politician': [/politicians from ./, /politician stubs$/, /. (democrats|republicans|politicians)$/, /mayors of ./],
  'Person/Athlete': [/sportspeople from ./, /(footballers|cricketers|defencemen|cyclists)/],
  'Person/Actor': [/actresses/, /actors from ./, /actor stubs$/],
  'Person/Artist': [/musicians from ./, /(singers|songwriters|painters|poets)/, /novelists from ./],
  // 'Person/Scientist': [(astronomers|physicists|biologists|chemists)],
  Person: [/[0-9]{4} births/, /[0-9]{4} deaths/, /people of .* descent/, /^(people|philanthropists|writers) from ./, / (players|alumni)$/, /(alumni|fellows) of .$/, /(people|writer) stubs$/, /(american|english) (fe)?male ./, /(american|english) (architects|people)/],
  // ==Place==
  'Place/Building': [/(buildings|bridges) completed in /, /airports established in ./, /(airports|bridges) in ./, /buildings and structures in ./],
  'Place/BodyOfWater': [/(rivers|lakes|tributaries) of ./],
  'Place/City': [/^cities and towns in ./, /(municipalities|settlements|villages|localities|townships) in ./],
  Place: [/populated places/, /landforms of ./, /railway stations/, /parks in ./, / district$/, /geography stubs$/, /sports venue stubs$/],
  // ==Creative Work==
  'CreativeWork/Album': [/[0-9]{4} albums/, /albums produced by /, / albums$/],
  'CreativeWork/Film': [/[0-9]{4} films/, / films$/],
  'CreativeWork/TVShow': [/television series/],
  CreativeWork: [/film stubs$/, /novel stubs$/, /[0-9]{4} video games/],
  // ==Event==
  'Event/SportsEvent': [/. league seasons$/, /^(19|20)[0-9]{2} in (soccer|football|rugby|tennis|basketball|baseball|cricket|sports)/],
  'Event/War': [/conflicts in [0-9]{4}/, /battles involving ./],
  Event: [/^(19|20)[0-9]{2} in /],
  // ==Orgs==
  'Organization/MusicalGroup': [/musical groups from /, /musical groups established in [0-9]{4}/, /musical group stubs/, /. music(al)? groups$/],
  'Organization/SportsTeam': [/sports clubs established in [0-9]{4}/, /football clubs in ./],
  'Organization/Company': [/companies (established|based) in ./],
  Organization: [/(organi[sz]ations|publications) based in /, /(organi[sz]ations|publications|schools|awards) established in [0-9]{4}/, /(secondary|primary) schools/, /military units/, /magazines/, /organi[sz]ation stubs$/]
};
var patterns_1 = patterns;

var mapping = {
  'living people': 'Person',
  'date of birth unknown': 'Person',
  'possibly living people': 'Person',
  'place of birth missing': 'Person',
  'american films': 'CreativeWork/Film',
  'english-language films': 'CreativeWork/Film',
  'grammy award winners': 'Organization/MusicalGroup',
  'musical quartets': 'Organization/MusicalGroup',
  'musical duos': 'Organization/MusicalGroup',
  'musical trios': 'Organization/MusicalGroup'
};

var byPattern = function byPattern(cat) {
  var types = Object.keys(patterns_1);

  for (var i = 0; i < types.length; i++) {
    var key = types[i];

    for (var o = 0; o < patterns_1[key].length; o++) {
      var reg = patterns_1[key][o];

      if (reg.test(cat) === true) {
        return key;
      }
    }
  }
};

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

    if (mapping.hasOwnProperty(cat)) {
      found.push(mapping[cat]);
      continue;
    } // loop through our patterns


    var match = byPattern(cat);

    if (match) {
      found.push(match);
    }
  }

  return found;
};

var byCategory_1 = byCategory;

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

var templates = {
  'Person/Actor': [/actor-stub$/],
  'Person/Politician': [/(politician|mayor)-stub$/],
  'Person/Artist': [/(artist|musician|singer)-stub$/],
  'Person/Athlete': [/sport-bio-stub$/],
  Person: [/-bio-stub$/],
  'CreativeWork/Book': [/-novel-stub$/],
  'CreativeWork/Film': [/-film-stub$/],
  'CreativeWork/Album': [/-album-stub$/],
  CreativeWork: [/-(play|song)-stub$/],
  'Event/Election': [/-election-stub$/],
  'Organization/SportsTeam': [/-sport-team-stub$/],
  'Organization/Company': [/-company-stub$/],
  'Place/BodyOfWater': [/-river-stub$/],
  Place: [/-geo-stub$/]
};

var mapping$1 = _defineProperty({
  //place
  coord: 'Place',
  'weather box': 'Place',
  //person
  persondata: 'Person',
  writer: 'Person',
  'ted speaker': 'Person',
  taxonbar: 'Thing/Organism',
  wikispecies: 'Thing/Organism',
  animalia: 'Thing/Organism',
  chordata: 'Thing/Organism',
  cnidaria: 'Thing/Organism',
  porifera: 'Thing/Organism',
  epicaridea: 'Thing/Organism',
  mammals: 'Thing/Organism',
  phlyctaeniidae: 'Thing/Organism',
  carnivora: 'Thing/Organism',
  clade: 'Thing/Organism',
  'life on earth': 'Thing/Organism',
  'orders of insects': 'Thing/Organism',
  coleoptera: 'Thing/Organism',
  'insects in culture': 'Thing/Organism',
  'living things in culture': 'Thing/Organism',
  'eukaryota classification': 'Thing/Organism'
}, "animalia", 'Thing/Organism');

var matchPatterns = function matchPatterns(title) {
  var types = Object.keys(templates);

  for (var i = 0; i < types.length; i++) {
    var key = types[i];

    for (var o = 0; o < templates[key].length; o++) {
      var reg = templates[key][o];

      if (reg.test(title) === true) {
        return key;
      }
    }
  }
};

var byTemplate = function byTemplate(doc) {
  var templates = doc.templates();
  var found = [];

  for (var i = 0; i < templates.length; i++) {
    var title = templates[i].template;

    if (mapping$1.hasOwnProperty(title)) {
      console.log(title);
      found.push(mapping$1[title]);
    } else {
      // try regex-list on it
      var type = matchPatterns(title);

      if (type) {
        console.log(title);
        found.push(type);
      }
    }
  }

  return found;
};

var byTemplate_1 = byTemplate;

var sections = {
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
  'critical reception': 'CreativeWork',
  'critical response': 'CreativeWork',
  'track listing': 'CreativeWork/Album',
  // org
  founding: 'Organization',
  founders: 'Organization',
  'coaching staff': 'Organization/SportsTeam',
  'band members': 'Organization/MusicalGroup',
  habitat: 'Thing/Organism',
  morphology: 'Thing/Organism',
  phylogeny: 'Thing/Organism',
  'distribution and diversity': 'Thing/Organism',
  'distribution and habitat': 'Thing/Organism',
  'reproduction and development': 'Thing/Organism',
  'taxonomy and phylogeny': 'Thing/Organism'
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

    if (sections.hasOwnProperty(title)) {
      found.push(sections[title]);
    }
  }

  return found;
};

var bySection = fromSection;

var _titles;

var titles = (_titles = {
  'tv series': 'CreativeWork/TVShow',
  album: 'CreativeWork/Album',
  song: 'CreativeWork',
  film: 'CreativeWork/Film',
  politician: 'Person/Politician',
  footballer: 'Person/Athlete',
  musician: 'Person/Artist',
  Virginia: 'Place',
  band: 'Organization/MusicalGroup',
  'delhi metro': 'Place'
}, _defineProperty(_titles, "tv series", 'CreativeWork/TVShow'), _defineProperty(_titles, 'uk parliament constituency', 'Place'), _defineProperty(_titles, 'new jersey', 'Place'), _defineProperty(_titles, "novel", 'CreativeWork/Book'), _defineProperty(_titles, "portugal", 'Place'), _defineProperty(_titles, "book", 'CreativeWork/Book'), _defineProperty(_titles, "character", 'Thing/Character'), _defineProperty(_titles, "company", 'Organization/Company'), _defineProperty(_titles, "india", 'Place'), _defineProperty(_titles, "game", 'Thing'), _defineProperty(_titles, 'video game', 'Thing/Product'), _defineProperty(_titles, 'computer game', 'Thing/Product'), _defineProperty(_titles, 'season 2', 'CreativeWork'), _defineProperty(_titles, "california", 'Place'), _defineProperty(_titles, "athlete", 'Person/Athlete'), _defineProperty(_titles, "soundtrack", 'CreativeWork'), _defineProperty(_titles, "cricketer", 'Person/Athlete'), _defineProperty(_titles, "horse", 'Thing'), _defineProperty(_titles, "newspaper", 'Organization/Company'), _defineProperty(_titles, "wrestler", 'Person/Athlete'), _defineProperty(_titles, "connecticut", 'Place'), _defineProperty(_titles, "uk", 'Place'), _defineProperty(_titles, "software", 'Thing/Software'), _defineProperty(_titles, "canada", 'Place'), _defineProperty(_titles, "journalist", 'Person'), _defineProperty(_titles, "bishop", 'Person'), _defineProperty(_titles, "train", 'Thing'), _defineProperty(_titles, '2006 film', 'CreativeWork'), _defineProperty(_titles, 'season 3', 'CreativeWork'), _defineProperty(_titles, "singer", 'Person/Artist'), _defineProperty(_titles, "actor", 'Person/Actor'), _defineProperty(_titles, "artist", 'Person/Artist'), _defineProperty(_titles, "volcano", 'Place'), _defineProperty(_titles, 'season 4', 'CreativeWork'), _defineProperty(_titles, 'united states', 'Place'), _defineProperty(_titles, 'united kingdom', 'Place'), _defineProperty(_titles, "movie", 'CreativeWork/Film'), _defineProperty(_titles, "judge", 'Person'), _defineProperty(_titles, 'football player', 'Person/Athlete'), _defineProperty(_titles, 'erie county, new york', 'Place'), _defineProperty(_titles, "arkansas", 'Place'), _defineProperty(_titles, "oklahoma", 'Place'), _defineProperty(_titles, "single", 'CreativeWork'), _defineProperty(_titles, "series", 'CreativeWork'), _defineProperty(_titles, "nigeria", 'Place'), _defineProperty(_titles, "pennsylvania", 'Place'), _defineProperty(_titles, "magazine", 'CreativeWork'), _defineProperty(_titles, "opera", 'CreativeWork'), _defineProperty(_titles, 'murder victim', 'Person'), _defineProperty(_titles, "australia", 'Place'), _defineProperty(_titles, 'The Twilight Zone', 'CreativeWork'), _defineProperty(_titles, "music", 'CreativeWork'), _defineProperty(_titles, "georgia", 'Place'), _defineProperty(_titles, "poet", 'Person'), _defineProperty(_titles, "va", 'Place'), _defineProperty(_titles, "play", 'CreativeWork'), _defineProperty(_titles, "actress", 'Person/Actor'), _defineProperty(_titles, "album", 'CreativeWork/Album'), _defineProperty(_titles, "ship", 'Thing'), _defineProperty(_titles, "spain", 'Place'), _defineProperty(_titles, "boxer", 'Person/Athlete'), _defineProperty(_titles, "author", 'Person'), _defineProperty(_titles, "painter", 'Person/Artist'), _defineProperty(_titles, "michigan", 'Place'), _defineProperty(_titles, "tv series", 'CreativeWork'), _defineProperty(_titles, "sudan", 'Place'), _defineProperty(_titles, "chad", 'Place'), _defineProperty(_titles, "brazil", 'Place'), _defineProperty(_titles, "france", 'Place'), _defineProperty(_titles, "director", 'Person'), _defineProperty(_titles, "alaska", 'Place'), _defineProperty(_titles, "priest", 'Person'), _defineProperty(_titles, "minister", 'Person'), _defineProperty(_titles, "province", 'Place'), _defineProperty(_titles, 'season 5', 'CreativeWork'), _defineProperty(_titles, "barbados", 'Place'), _defineProperty(_titles, "diplomat", 'Person'), _defineProperty(_titles, "japan", 'Place'), _defineProperty(_titles, 'new york', 'Place'), _defineProperty(_titles, "ontario", 'Place'), _defineProperty(_titles, "painting", 'Thing'), _defineProperty(_titles, "cocktail", 'Thing'), _defineProperty(_titles, 'cedar busway station', 'Place'), _defineProperty(_titles, "cyclist", 'Person'), _defineProperty(_titles, "book", 'CreativeWork'), _defineProperty(_titles, 'cape verde', 'Place'), _defineProperty(_titles, "river", 'Place/BodyOfWater'), _defineProperty(_titles, 'australian politician', 'Person/Politician'), _defineProperty(_titles, "businessman", 'Person'), _defineProperty(_titles, 'canadian politician', 'Person/Politician'), _defineProperty(_titles, "academic", 'Person'), _defineProperty(_titles, "dominica", 'Place'), _defineProperty(_titles, "journal", 'Organization'), _defineProperty(_titles, "plant", 'Thing'), _defineProperty(_titles, 'north carolina', 'Place'), _defineProperty(_titles, 'new york City Subway', 'Place'), _defineProperty(_titles, "candy", 'Thing'), _defineProperty(_titles, "group", 'Organization'), _defineProperty(_titles, "chicago", 'Place'), _defineProperty(_titles, "argentina", 'Place'), _defineProperty(_titles, "manhattan", 'Place'), _defineProperty(_titles, 'new orleans', 'Place'), _defineProperty(_titles, "song", 'CreativeWork'), _defineProperty(_titles, "rapper", 'Person/Artist'), _defineProperty(_titles, "drink", 'Thing'), _defineProperty(_titles, "composer", 'Person/Artist'), _defineProperty(_titles, "texas", 'Place'), _defineProperty(_titles, 'new zealand', 'Place'), _defineProperty(_titles, "miniseries", 'CreativeWork'), _defineProperty(_titles, 'northern ireland', 'Place'), _defineProperty(_titles, "drummer", 'Person'), _defineProperty(_titles, 'sri lanka', 'Place'), _defineProperty(_titles, 'gaelic footballer', 'Person/Athlete'), _defineProperty(_titles, "ballet", 'CreativeWork'), _defineProperty(_titles, 'american football player', 'Person/Athlete'), _defineProperty(_titles, "colombia", 'Place'), _defineProperty(_titles, "israel", 'Place'), _defineProperty(_titles, "washington", 'Place'), _defineProperty(_titles, "edmonton", 'Place'), _defineProperty(_titles, "plant", 'Thing/Organism'), _titles);
var titles_1 = titles.album;
var titles_2 = titles.song;
var titles_3 = titles.film;
var titles_4 = titles.politician;
var titles_5 = titles.footballer;
var titles_6 = titles.musician;
var titles_7 = titles.Virginia;
var titles_8 = titles.band;
var titles_9 = titles.novel;
var titles_10 = titles.portugal;
var titles_11 = titles.book;
var titles_12 = titles.character;
var titles_13 = titles.company;
var titles_14 = titles.india;
var titles_15 = titles.game;
var titles_16 = titles.california;
var titles_17 = titles.athlete;
var titles_18 = titles.soundtrack;
var titles_19 = titles.cricketer;
var titles_20 = titles.horse;
var titles_21 = titles.newspaper;
var titles_22 = titles.wrestler;
var titles_23 = titles.connecticut;
var titles_24 = titles.uk;
var titles_25 = titles.software;
var titles_26 = titles.canada;
var titles_27 = titles.journalist;
var titles_28 = titles.bishop;
var titles_29 = titles.train;
var titles_30 = titles.singer;
var titles_31 = titles.actor;
var titles_32 = titles.artist;
var titles_33 = titles.volcano;
var titles_34 = titles.movie;
var titles_35 = titles.judge;
var titles_36 = titles.arkansas;
var titles_37 = titles.oklahoma;
var titles_38 = titles.single;
var titles_39 = titles.series;
var titles_40 = titles.nigeria;
var titles_41 = titles.pennsylvania;
var titles_42 = titles.magazine;
var titles_43 = titles.opera;
var titles_44 = titles.australia;
var titles_45 = titles.music;
var titles_46 = titles.georgia;
var titles_47 = titles.poet;
var titles_48 = titles.va;
var titles_49 = titles.play;
var titles_50 = titles.actress;
var titles_51 = titles.ship;
var titles_52 = titles.spain;
var titles_53 = titles.boxer;
var titles_54 = titles.author;
var titles_55 = titles.painter;
var titles_56 = titles.michigan;
var titles_57 = titles.sudan;
var titles_58 = titles.chad;
var titles_59 = titles.brazil;
var titles_60 = titles.france;
var titles_61 = titles.director;
var titles_62 = titles.alaska;
var titles_63 = titles.priest;
var titles_64 = titles.minister;
var titles_65 = titles.province;
var titles_66 = titles.barbados;
var titles_67 = titles.diplomat;
var titles_68 = titles.japan;
var titles_69 = titles.ontario;
var titles_70 = titles.painting;
var titles_71 = titles.cocktail;
var titles_72 = titles.cyclist;
var titles_73 = titles.river;
var titles_74 = titles.businessman;
var titles_75 = titles.academic;
var titles_76 = titles.dominica;
var titles_77 = titles.journal;
var titles_78 = titles.plant;
var titles_79 = titles.candy;
var titles_80 = titles.group;
var titles_81 = titles.chicago;
var titles_82 = titles.argentina;
var titles_83 = titles.manhattan;
var titles_84 = titles.rapper;
var titles_85 = titles.drink;
var titles_86 = titles.composer;
var titles_87 = titles.texas;
var titles_88 = titles.miniseries;
var titles_89 = titles.drummer;
var titles_90 = titles.ballet;
var titles_91 = titles.colombia;
var titles_92 = titles.israel;
var titles_93 = titles.washington;
var titles_94 = titles.edmonton;

var patterns$1 = {
  'CreativeWork/Film': [/ \([0-9]{4} film\)$/],
  CreativeWork: [/ \((.*? )song\)$/]
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

  if (titles.hasOwnProperty(inside)) {
    return [titles[inside]];
  } // look at regex


  var keys = Object.keys(patterns$1);

  for (var o = 0; o < keys.length; o++) {
    var k = keys[o];

    for (var i = 0; i < patterns$1[k].length; i++) {
      var reg = patterns$1[k][i];

      if (reg.test(title)) {
        return [k];
      }
    }
  }

  return [];
};

var byTitle_1 = byTitle;

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
  var title = doc.title(); //look at parentheses like 'Tornado (film)'

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
};

var _skip = skipPage;

var tree = {
  Person: {
    Athlete: true,
    Artist: true,
    Politician: true,
    Scientist: true,
    Actor: true
  },
  Place: {
    Country: true,
    City: true,
    Structure: true,
    BodyOfWater: true
  },
  Organization: {
    Company: true,
    SportsTeam: true,
    MusicalGroup: true
  },
  CreativeWork: {
    Film: true,
    TVShow: true,
    Book: true,
    Album: true
  },
  Event: {
    Election: true,
    Disaster: true,
    SportsEvent: true,
    War: true
  },
  Thing: {
    Product: true,
    Software: true,
    Character: true,
    Organism: true
  }
};

var isObject = function isObject(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]';
};

var doit = function doit(type, obj) {
  Object.keys(obj).forEach(function (k) {
    var tmp = k;

    if (type) {
      tmp = type + '/' + k;
    }

    if (isObject(tree[k])) {
      doit(tmp, tree[k]);
    }
  });
};

doit('', tree);

var plugin = function plugin(models) {
  // add a new method to main class
  models.Doc.prototype.classify = function (options) {
    var doc = this;
    var res = {}; // dont classify these

    if (_skip(doc)) {
      return null;
    } //look for 'infobox person', etc


    res.infobox = byInfobox_1(doc); //look for '{{coord}}'

    res.template = byTemplate_1(doc); //look for '==early life=='

    res.section = bySection(doc); //look for 'foo (film)'

    res.title = byTitle_1(doc); //look for 'Category: 1992 Births', etc

    res.category = byCategory_1(doc); // let scored = score(res)

    return res;
  };
};

var src = plugin;

export default src;
