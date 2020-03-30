/* wtf-plugin-classify 0.0.1  MIT */
;(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.wtf = factory()))
})(this, function() {
  'use strict'

  var mapping = {
    actor: 'Person/Actor',
    //1
    adult_biography: 'Person',
    //2
    afl_biography: 'Person/Athlete',
    //7
    aircraft_accident: 'Event/Disaster',
    //2
    aircraft_begin: 'Thing',
    //24
    aircraft_engine: 'Thing',
    //2
    aircraft_type: 'Thing',
    //21
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
    artifact: 'Thing',
    //1
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
    automobile: 'Thing/Product',
    //8
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
    character: 'Thing/Character',
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
    comics_character: 'Thing/Character',
    //13
    comics_creator: 'Person',
    //10
    company: 'Organization',
    //150
    computer_hardware_bus: 'Thing',
    //1
    computer_virus: 'Thing/Software',
    //1
    concert_tour: 'Event',
    //8
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
    electric_vehicle: 'Thing/Product',
    //1
    engineer: 'Person',
    //2
    enzyme: 'Thing',
    //19
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
    gaa_club: 'Organization',
    //2
    gaa_player: 'Person/Athlete',
    //15
    game: 'Thing',
    //3
    gene: 'Thing',
    //3
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
    gpu: 'Thing/Product',
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
    mineral: 'Thing',
    //5
    minister: 'Person/ReligiousFigure',
    //3
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
    religious_text: 'Thing',
    //1
    river: 'Place/BodyOfWater',
    //16
    road: 'Place',
    //41
    road_small: 'Place',
    //14
    rocket: 'Thing',
    //3
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
    skier: 'Person/Athlete',
    //14
    soap_character: 'Thing/Character',
    //126
    software: 'Thing/Software',
    //25
    software_license: 'Thing',
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
    thoroughbred_racehorse: 'Thing',
    //7
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
    wrc_driver: 'Person',
    //1
    wrestling_event: 'Event/SportsEvent',
    //8
    writer: 'Person',
    //69
    writing_system: 'Thing',
    //4
    zoo: 'Place',
    //3
    speciesbox: 'Organism',
    'automatic taxobox': 'Organism',
    // march 29th
    'video game': 'CreativeWork/VideoGame',
    'television episode': 'CreativeWork',
    'comic book title': 'CreativeWork',
    'song contest entry': 'CreativeWork',
    'short story': 'CreativeWork',
    play: 'CreativeWork',
    'hollywood cartoon': 'CreativeWork',
    'radio show': 'CreativeWork',
    'simpsons episode': 'CreativeWork',
    'musical composition': 'CreativeWork',
    'book series': 'CreativeWork',
    'comic strip': 'CreativeWork',
    'd&d creature': 'Thing/Character',
    'television season': 'CreativeWork',
    'comics organization': 'CreativeWork',
    'doctor who episode': 'CreativeWork',
    'animanga/other': 'CreativeWork',
    'graphic novel': 'CreativeWork',
    rpg: 'CreativeWork',
    'vg character': 'Thing/Character',
    'big finish': 'CreativeWork',
    'vg series': 'CreativeWork',
    'name module': 'CreativeWork',
    'comics story arc': 'CreativeWork',
    'animanga character': 'Thing/Character',
    'video game series': 'CreativeWork',
    'fictional location': 'Thing',
    'futurama episode': 'CreativeWork',
    'video game character': 'Thing/Character',
    'comics character and title': 'CreativeWork',
    'comics meta series': 'CreativeWork',
    webcomic: 'CreativeWork',
    'the goodies episode': 'CreativeWork',
    'audio drama': 'CreativeWork',
    'comics species': 'Thing',
    'sw comics': 'CreativeWork',
    'media franchise': 'CreativeWork',
    'folk tale': 'CreativeWork',
    'doctor who character': 'Thing/Character',
    'tolkien character': 'Thing/Character',
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
    'airliner accident': 'Event/Disaster',
    'football tournament': 'Event/SportsEvent',
    'individual darts tournament': 'Event',
    'nfl season': 'Event/SportsEvent',
    'beauty pageant': 'Event',
    'nfl draft': 'Event/SportsEvent',
    'athletics championships': 'Event/SportsEvent',
    'historical event': 'Event',
    'grand prix motorcycle race report': 'Event',
    'football club season': 'Event/SportsEvent',
    'international handball competition': 'Event',
    'coa case': 'Event',
    'individual snooker tournament': 'Event',
    'canadian football game': 'Event/SportsEvent',
    'australian rules football season': 'Event/SportsEvent',
    'football tournament season': 'Event/SportsEvent',
    'esc national year': 'Event',
    indy500: 'Event',
    'international ice hockey competition': 'Event/SportsEvent',
    'cricket tour': 'Event/SportsEvent',
    'national political convention': 'Event',
    referendum: 'Event',
    // learned organization
    'football club': 'Organization/SportsTeam',
    'radio station': 'Organization',
    'military unit': 'Organization',
    'political party': 'Organization/PoliticalParty',
    'government agency': 'Organization',
    'rail line': 'Organization',
    'record label': 'Organization',
    'school district': 'Organization',
    'tv channel': 'Organization',
    'sports league': 'Organization',
    'football league': 'Organization',
    worldscouting: 'Organization',
    'rugby team': 'Organization/SportsTeam',
    'sg rail': 'Organization',
    'law enforcement agency': 'Organization',
    'uk legislation': 'Organization',
    'public transit': 'Organization',
    'us university ranking': 'Organization',
    'television channel': 'Organization',
    'national football team': 'Organization/SportsTeam',
    'bus transit': 'Organization',
    union: 'Organization',
    'broadcasting network': 'Organization',
    'christian denomination': 'Organization',
    'film awards': 'Organization',
    'gaa club': 'Organization',
    fraternity: 'Organization',
    rail: 'Organization',
    'rail service': 'Organization',
    'national military': 'Organization',
    'sport governing body': 'Organization',
    'basketball club': 'Organization/SportsTeam',
    'hockey team': 'Organization/SportsTeam',
    'political party/seats': 'Organization',
    'rugby league club': 'Organization/SportsTeam',
    'athletic conference': 'Organization',
    'football club infobox': 'Organization/SportsTeam',
    'film festival': 'Organization',
    'medical condition (new)': 'Organization',
    brand: 'Organization/MusicalGroup',
    'cricket team': 'Organization/SportsTeam',
    'dot-com company': 'Organization',
    'india university ranking': 'Organization',
    'uk university rankings': 'Organization',
    'government cabinet': 'Organization',
    //learned organisms
    taxobox: 'Organism',
    subspeciesbox: 'Organism',
    mycomorphbox: 'Organism',
    'paraphyletic group': 'Organism',
    'nutritional value': 'Organism',
    infraspeciesbox: 'Organism',
    disease: 'Thing',
    'mythical creature': 'Thing',
    ecoregion: 'Place',
    horse: 'Organism',
    haplogroup: 'Organism',
    bird: 'Organism',
    'bird/population': 'Organism',
    'medical resources': 'Organism',
    'college mascot': 'Thing',
    galaxy: 'Thing',
    'dog breed': 'Organism',
    'nc name': 'Organism',
    'pig breed': 'Organism',
    'botanical product': 'Organism',
    'cattle breed': 'Organism',
    bishop: 'Person/ReligiousFigure',
    'grape variety': 'Organism',
    'horse breed': 'Organism',
    'poultry breed': 'Organism',
    // learned people
    'football biography': 'Person/Athlete',
    'military person': 'Person',
    'baseball biography': 'Person/Athlete',
    'ice hockey player': 'Person/Athlete',
    'nfl player': 'Person/Athlete',
    'christian leader': 'Person/ReligiousFigure',
    congressman: 'Person/Politician',
    'basketball biography': 'Person/Athlete',
    'comics creator': 'Person/Artist',
    'professional wrestler': 'Person/Athlete',
    'college coach': 'Person',
    'tennis biography': 'Person/Athlete',
    'afl biography': 'Person/Athlete',
    'nfl biography': 'Person/Athlete',
    'rugby biography': 'Person/Athlete',
    'rugby league biography': 'Person/Athlete',
    'prime minister': 'Person/Politician',
    'nba biography': 'Person/Athlete',
    'figure skater': 'Person/Athlete',
    'f1 driver': 'Person',
    'gridiron football person': 'Person',
    'indian politician': 'Person/Politician',
    'racing driver': 'Person',
    'martial artist': 'Person',
    'chinese-language singer and actor': 'Person',
    astronaut: 'Person',
    senator: 'Person/Politician',
    'nascar driver': 'Person',
    'adult biography': 'Person',
    'state representative': 'Person/Politician',
    'state senator': 'Person/Politician',
    'coa wide': 'Person',
    'religious biography': 'Person/ReligiousFigure',
    'chess player': 'Person',
    'pageant titleholder': 'Person',
    'gaa player': 'Person/Athlete',
    'us cabinet official': 'Person/Politician',
    // learned places
    'uk place': 'Place',
    'italian comune': 'Place',
    geobox: 'Place',
    'australian place': 'Place',
    'french commune': 'Place',
    'german location': 'Place',
    'u.s. county': 'Place',
    'swiss town': 'Place/City',
    'former country': 'Place',
    'uk school': 'Place/Structure',
    'road small': 'Place',
    'lunar crater': 'Place',
    'gb station': 'Place',
    'greek dimos': 'Place',
    'military structure': 'Place/Structure',
    'uk constituency main': 'Place',
    'city japan': 'Place/City',
    'religious building': 'Place/Structure',
    'shopping mall': 'Place/Structure',
    'municipality br': 'Place/City',
    'finnish municipality/population count': 'Place',
    'ancient site': 'Place',
    'mountain range': 'Place',
    'london station': 'Place',
    'russian town': 'Place/City',
    'former subdivision': 'Place',
    lighthouse: 'Place/Structure',
    'uk station': 'Place',
    'historic site': 'Place',
    'world heritage site': 'Place',
    diocese: 'Place',
    'south african town 2011': 'Place/City',
    'uk disused station': 'Place',
    'belgium municipality': 'Place',
    'uk constituency': 'Place',
    theatre: 'Place',
    'canada electoral district': 'Place',
    nycs: 'Place',
    'body of water': 'Place/BodyOfWater',
    'mountain pass': 'Place',
    kommune: 'Place',
    'historic subdivision': 'Place',
    'u.s. congressional district': 'Place',
    'power station': 'Place/Structure'
  }

  var byInfobox = function byInfobox(doc) {
    var infoboxes = doc.infoboxes()
    var found = []

    for (var i = 0; i < infoboxes.length; i++) {
      var inf = infoboxes[i]
      var type = inf.type()
      type = type.toLowerCase()
      type = type.replace(/^(category|categorie|kategori): ?/i, '')
      type = type.replace(/ /g, '_')
      type = type.trim()

      if (mapping.hasOwnProperty(type)) {
        found.push({
          cat: mapping[type],
          reason: type
        })
      }
    }

    return found
  }

  var byInfobox_1 = byInfobox

  var patterns = {
    'Thing/Character': [/(fictional|television) characters/],
    'Thing/Product': [/products introduced in ./, /musical instruments/],
    'Thing/Software': [/software using ./],
    Organism: [
      /(funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants) of ./,
      / first appearances/,
      / . described in [0-9]{4}/,
      /. (phyla|genera)$/,
      /. taxonomic families$/,
      /plants used in ./,
      / (funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants)$/
    ],
    // ==Person==
    'Person/Politician': [
      /politicians from ./,
      /politician stubs$/,
      /. (democrats|republicans|politicians)$/,
      /mayors of ./
    ],
    'Person/Athlete': [/sportspeople from ./, /(footballers|cricketers|defencemen|cyclists)/],
    'Person/Actor': [/actresses/, /actors from ./, /actor stubs$/, / (actors|actresses)$/],
    'Person/Artist': [
      /musicians from ./,
      /(singers|songwriters|painters|poets)/,
      /novelists from ./
    ],
    // 'Person/Scientist': [(astronomers|physicists|biologists|chemists)],
    Person: [
      /[0-9]{4} births/,
      /[0-9]{4} deaths/,
      /people of .* descent/,
      /^deaths from /,
      /^(people|philanthropists|writers) from ./,
      / (players|alumni)$/,
      /(alumni|fellows) of .$/,
      /(people|writer) stubs$/,
      /(american|english) (fe)?male ./,
      /(american|english) (architects|people)/
    ],
    // ==Place==
    'Place/Building': [
      /(buildings|bridges) completed in /,
      /airports established in ./,
      /(airports|bridges) in ./,
      /buildings and structures in ./
    ],
    'Place/BodyOfWater': [/(rivers|lakes|tributaries) of ./],
    'Place/City': [
      /^cities and towns in ./,
      /(municipalities|settlements|villages|localities|townships) in ./
    ],
    Place: [
      /populated places/,
      /landforms of ./,
      /railway stations/,
      /parks in ./,
      / district$/,
      /geography stubs$/,
      /sports venue stubs$/
    ],
    // ==Creative Work==
    'CreativeWork/Album': [/[0-9]{4}.*? albums/, /^albums /, / albums$/],
    'CreativeWork/Film': [/[0-9]{4}.*? films/, / films$/, /^films /],
    'CreativeWork/TVShow': [/television series/],
    'CreativeWork/VideoGame': [/video games/],
    CreativeWork: [/(film|novel|album) stubs$/, /[0-9]{4}.*? (poems|novels)/, / (poems|novels)$/],
    // ==Event==
    'Event/SportsEvent': [
      /. league seasons$/,
      /^(19|20)[0-9]{2} in (soccer|football|rugby|tennis|basketball|baseball|cricket|sports)/
    ],
    'Event/MilitaryConflict': [
      /conflicts (in|of) [0-9]{4}/,
      /(wars|battles|conflicts) (involving|of|in) ./
    ],
    Event: [/^(19|20)[0-9]{2} in /, /^(years of the )?[0-9]{1,2}(st|nd|rd|th)? century in ./],
    // ==Orgs==
    'Organization/MusicalGroup': [
      /musical groups from /,
      /musical groups established in [0-9]{4}/,
      /musical group stubs/,
      /. music(al)? groups$/
    ],
    'Organization/SportsTeam': [/sports clubs established in [0-9]{4}/, /football clubs in ./],
    'Organization/Company': [/companies (established|based) in ./],
    Organization: [
      /(organi[sz]ations|publications) based in /,
      /(organi[sz]ations|publications|schools|awards) established in [0-9]{4}/,
      /(secondary|primary) schools/,
      /military units/,
      /magazines/,
      /organi[sz]ation stubs$/
    ]
  }
  var patterns_1 = patterns

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
    'nasa space probes': 'Event',
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
    'human spaceflights': 'Event',
    'missions to mars': 'Event',
    'derelict space probes': 'Event',
    'luna program': 'Event',
    'proxy wars': 'Event/MilitaryConflict',
    'conflicts in 1942': 'Event',
    'special air service': 'Event',
    'spacecraft launched by delta ii rockets': 'Event',
    'soft landings on the moon': 'Event',
    'may observances': 'Event',
    '1904 summer olympics events': 'Event/SportsEvent',
    '1900 summer olympics events': 'Event/SportsEvent',
    'space shuttle missions': 'Event',
    'apollo program missions': 'Event',
    'spacecraft launched in 1962': 'Event',
    'spacecraft launched by titan rockets': 'Event',
    'first events': 'Event',
    'recent years': 'Event',
    'elections not won by the popular vote winner': 'Event',
    'conflicts in 1864': 'Event',
    '1862 in the american civil war': 'Event',
    'new zealand wars': 'Event/MilitaryConflict',
    'battles between england and scotland': 'Event/MilitaryConflict',
    '2002 winter olympics events': 'Event/SportsEvent',
    'spacecraft launched by atlas-centaur rockets': 'Event',
    'space observatories': 'Event',
    'new york (state) in the american revolution': 'Event',
    'march observances': 'Event',
    'public holidays in the united states': 'Event',
    'conflicts in 1943': 'Event/MilitaryConflict',
    'spacecraft launched in 1966': 'Event',
    'last stand battles': 'Event/MilitaryConflict',
    '1944 in france': 'Event',
    'battles and conflicts without fatalities': 'Event/MilitaryConflict',
    'manned missions to the moon': 'Event',
    'sample return missions': 'Event',
    '1973 in spaceflight': 'Event',
    'guerrilla wars': 'Event/MilitaryConflict',
    'retired atlantic hurricanes': 'Event/Disaster',
    'december observances': 'Event',
    '20th century american trials': 'Event',
    'african-american civil rights movement (1954–68)': 'Event',
    '20th-century conflicts': 'Event/MilitaryConflict',
    'presidential elections in ireland': 'Event/Election',
    'spacecraft launched in 1973': 'Event',
    'october observances': 'Event',
    'spring holidays': 'Event',
    'years in aviation': 'Event',
    'national days': 'Event',
    'project gemini missions': 'Event',
    'spacecraft launched in 1965': 'Event',
    '20th-century revolutions': 'Event/MilitaryConflict',
    'spacecraft launched in 1971': 'Event',
    'fifa world cup tournaments': 'Event/SportsEvent',
    'summer holidays': 'Event',
    'sieges involving japan': 'Event/MilitaryConflict',
    'lunar flybys': 'Event',
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
    'american presbyterians': 'Person',
    // learned things
    'gnu project': 'Thing/Software',
    'massachusetts institute of technology software': 'Thing/Software'
  }

  var byPattern = function byPattern(str, patterns) {
    var types = Object.keys(patterns)

    for (var i = 0; i < types.length; i++) {
      var key = types[i]

      for (var o = 0; o < patterns[key].length; o++) {
        var reg = patterns[key][o]

        if (reg.test(str) === true) {
          return key
        }
      }
    }

    return null
  }

  var _byPattern = byPattern

  var byCategory = function byCategory(doc) {
    var found = []
    var cats = doc.categories() // clean them up a bit

    cats = cats.map(function(cat) {
      cat = cat.toLowerCase()
      cat = cat.replace(/^(category|categorie|kategori): ?/i, '')
      cat = cat.replace(/_/g, ' ')
      return cat.trim()
    }) // loop through each

    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i] // try our 1-to-1 mapping

      if (mapping$1.hasOwnProperty(cat)) {
        found.push({
          cat: mapping$1[cat],
          reason: cat
        })
        continue
      } // loop through our patterns

      var match = _byPattern(cat, patterns_1)

      if (match) {
        found.push({
          cat: match,
          reason: cat
        })
      }
    }

    return found
  }

  var byCategory_1 = byCategory

  var patterns$1 = {
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
  }

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
    vgrelease: 'CreativeWork',
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
    listen: 'CreativeWork',
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
    'multiple image': 'Organism',
    'iucn map': 'Organism',
    'xeno-canto species': 'Organism',
    avibase: 'Organism',
    'collapsible list': 'Organism',
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
    'post-nominals': 'Person',
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
    wikivoyage: 'Place',
    representative: 'Place',
    'historical populations': 'Place',
    'wikivoyage-inline': 'Place',
    'election box': 'Place',
    zh: 'Place',
    'wide image': 'Place'
  }

  var byTemplate = function byTemplate(doc) {
    var templates = doc.templates()
    var found = []

    for (var i = 0; i < templates.length; i++) {
      var title = templates[i].template

      if (mapping$2.hasOwnProperty(title)) {
        found.push({
          cat: mapping$2[title],
          reason: title
        })
      } else {
        // try regex-list on it
        var type = _byPattern(title, patterns$1)

        if (type) {
          found.push({
            cat: type,
            reason: title
          })
        }
      }
    }

    return found
  }

  var byTemplate_1 = byTemplate

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
    'critical reception': 'CreativeWork',
    'critical response': 'CreativeWork',
    'track listing': 'CreativeWork/Album',
    // org
    founding: 'Organization',
    founders: 'Organization',
    'coaching staff': 'Organization/SportsTeam',
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
    production: 'CreativeWork',
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
    'mission highlights': 'Event',
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
    origins: 'Organization',
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
    ancestry: 'Person',
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
    films: 'Person',
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
    churches: 'Place',
    // learned things
    compatibility: 'Thing',
    compliance: 'Thing',
    'key features': 'Thing'
  }

  var fromSection = function fromSection(doc) {
    var found = []
    var titles = doc.sections().map(function(s) {
      var str = s.title()
      str = str.toLowerCase().trim()
      return str
    })

    for (var i = 0; i < titles.length; i++) {
      var title = titles[i]

      if (mapping$3.hasOwnProperty(title)) {
        found.push({
          cat: mapping$3[title],
          reason: title
        })
      }
    }

    return found
  }

  var bySection = fromSection

  var mapping$4 = {
    'american football player': 'Person/Athlete',
    'australian politician': 'Person/Politician',
    'canadian politician': 'Person/Politician',
    'cape verde': 'Place',
    'cedar busway station': 'Place',
    'computer game': 'Thing/Product',
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
    candy: 'Thing',
    chad: 'Place',
    character: 'Thing/Character',
    chicago: 'Place',
    cocktail: 'Thing',
    colombia: 'Place',
    company: 'Organization/Company',
    composer: 'Person/Artist',
    connecticut: 'Place',
    cricketer: 'Person/Athlete',
    cyclist: 'Person',
    diplomat: 'Person',
    director: 'Person',
    dominica: 'Place',
    drink: 'Thing',
    drummer: 'Person',
    edmonton: 'Place',
    footballer: 'Person/Athlete',
    france: 'Place',
    game: 'Thing',
    georgia: 'Place',
    group: 'Organization',
    horse: 'Thing',
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
    painting: 'Thing',
    pennsylvania: 'Place',
    plant: 'Organism',
    play: 'CreativeWork',
    poet: 'Person',
    politician: 'Person/Politician',
    portugal: 'Place',
    priest: 'Person',
    province: 'Place',
    rapper: 'Person/Artist',
    river: 'Place/BodyOfWater',
    series: 'CreativeWork',
    ship: 'Thing',
    singer: 'Person/Artist',
    single: 'CreativeWork',
    software: 'Thing/Software',
    song: 'CreativeWork',
    soundtrack: 'CreativeWork',
    spain: 'Place',
    sudan: 'Place',
    texas: 'Place',
    train: 'Thing',
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
    // learned things
    'programming language': 'Thing/Software',
    genus: 'Organism',
    missile: 'Thing',
    'board game': 'Thing/Product',
    'new york city subway car': 'Thing',
    instrument: 'Thing',
    food: 'Thing',
    fish: 'Organism',
    bird: 'Organism',
    'operating system': 'Thing/Software',
    'file format': 'Thing',
    'computer virus': 'Thing/Software',
    'card game': 'Thing/Product',
    automobile: 'Thing/Product',
    rocket: 'Thing',
    website: 'Thing/Software'
  }

  var patterns$2 = {
    'CreativeWork/Film': [/ \([0-9]{4} film\)$/],
    CreativeWork: [/ \((.*? )song\)$/],
    Event: [/ \((19|20)[0-9]{2}\)$/]
  }

  var paren = /\((.*)\)$/

  var byTitle = function byTitle(doc) {
    var title = doc.title()

    if (!title) {
      return []
    } //look at parentheses like 'Tornado (film)'

    var m = title.match(paren)

    if (!m) {
      return []
    }

    var inside = m[1] || ''
    inside = inside.toLowerCase()
    inside = inside.replace(/_/g, ' ')
    inside = inside.trim() //look at known parentheses

    if (mapping$4.hasOwnProperty(inside)) {
      return [
        {
          cat: mapping$4[inside],
          reason: inside
        }
      ]
    } // look at regex

    var match = _byPattern(title, patterns$2)

    if (match) {
      return [
        {
          cat: match,
          reason: title
        }
      ]
    }

    return []
  }

  var byTitle_1 = byTitle

  var skip = {
    disambiguation: true,
    surname: true,
    name: true,
    'given name': true
  }
  var paren$1 = /\((.*)\)$/
  var listOf = /^list of ./
  var disambig = /\(disambiguation\)/

  var skipPage = function skipPage(doc) {
    var title = doc.title() || '' //look at parentheses like 'Tornado (film)'

    var m = title.match(paren$1)

    if (!m) {
      return null
    }

    var inside = m[1] || ''
    inside = inside.toLowerCase()
    inside = inside.replace(/_/g, ' ')
    inside = inside.trim() //look at known parentheses

    if (skip.hasOwnProperty(inside)) {
      return true
    } //try a regex

    if (listOf.test(title) === true) {
      return true
    }

    if (disambig.test(title) === true) {
      return true
    }

    return false
  }

  var _skip = skipPage

  var topk = function topk(arr) {
    var obj = {}
    arr.forEach(function(a) {
      obj[a] = obj[a] || 0
      obj[a] += 1
    })
    var res = Object.keys(obj).map(function(k) {
      return [k, obj[k]]
    })
    return res.sort(function(a, b) {
      return a[1] > b[1] ? -1 : 0
    })
  }

  var parse = function parse(cat) {
    var split = cat.split(/\//)
    return {
      root: split[0],
      child: split[1]
    }
  }

  var getScore = function getScore(detail) {
    var cats = []
    Object.keys(detail).forEach(function(k) {
      detail[k].forEach(function(obj) {
        cats.push(parse(obj.cat))
      })
    }) // find top parent

    var roots = cats
      .map(function(obj) {
        return obj.root
      })
      .filter(function(s) {
        return s
      })
    var top = topk(roots)[0]

    if (!top) {
      return {
        detail: detail,
        category: null,
        score: 0
      }
    }

    var root = top[0] // score as % of results

    var score = top[1] / cats.length // punish low counts

    if (top[1] === 1) {
      score *= 0.75
    }

    if (top[1] === 2) {
      score *= 0.85
    }

    if (top[1] === 3) {
      score *= 0.95
    } // find 2nd level

    var children = cats
      .map(function(obj) {
        return obj.child
      })
      .filter(function(s) {
        return s
      })
    var tops = topk(children)
    top = tops[0]
    var category = root

    if (top) {
      category = ''.concat(root, '/').concat(top[0]) // punish for any conflicting children

      if (tops.length > 1) {
        score *= 0.7
      } // punish for low count

      if (top[1] === 1) {
        score *= 0.8
      }
    }

    return {
      root: root,
      category: category,
      score: Math.ceil(score),
      detail: detail
    }
  }

  var score = getScore

  var plugin = function plugin(models) {
    // add a new method to main class
    models.Doc.prototype.classify = function(options) {
      var doc = this
      var res = {} // dont classify these

      if (_skip(doc)) {
        return score(res)
      } //look for 'infobox person', etc

      res.infobox = byInfobox_1(doc) //look for '{{coord}}'

      res.template = byTemplate_1(doc) //look for '==early life=='

      res.section = bySection(doc) //look for 'foo (film)'

      res.title = byTitle_1(doc) //look for 'Category: 1992 Births', etc

      res.category = byCategory_1(doc)
      return score(res)
    }
  }

  var src = plugin

  return src
})
//# sourceMappingURL=wtf-plugin-classify.js.map
