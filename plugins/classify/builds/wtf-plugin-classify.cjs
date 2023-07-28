/* wtf-plugin-classify 2.1.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfClassify = factory());
})(this, (function () { 'use strict';

  var AmericanFootballPlayer = {
    name: 'AmericanFootballPlayer',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/football players/],
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
  };

  var BaseballPlayer = {
    name: 'BaseballPlayer',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/baseball players/],
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
      mapping: ['baseball year'],
      patterns: [],
    },
    //
    titles: {
      mapping: [],
      patterns: [],
    },
  };

  var FootballPlayer = {
    name: 'FootballPlayer',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/ f.c. players/, /soccer players/],
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
  };

  var BasketballPlayer = {
    name: 'BasketballPlayer',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/basketball players/],
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
  };

  var HockeyPlayer = {
    name: 'HockeyPlayer',
    //
    children: {},
    //
    categories: {
      mapping: [
        'stanley cup champions',
        'anaheim ducks players',
        'arizona coyotes players',
        'atlanta flames players',
        'atlanta thrashers players',
        'boston bruins players',
        'brooklyn americans players',
        'buffalo sabres players',
        'calgary flames players',
        'california golden seals players',
        'carolina hurricanes players',
        'chicago blackhawks players',
        'cleveland barons (nhl) players',
        'colorado avalanche players',
        'colorado rockies (nhl) players',
        'columbus blue jackets players',
        'dallas stars players',
        'detroit cougars players',
        'detroit falcons players',
        'detroit red wings players',
        'edmonton oilers players',
        'florida panthers players',
        'hamilton tigers (ice hockey) players',
        'hartford whalers players',
        'kansas city scouts players',
        'los angeles kings players',
        'mighty ducks of anaheim players',
        'minnesota north stars players',
        'minnesota wild players',
        'montreal canadiens players',
        'montreal maroons players',
        'montreal wanderers (nhl) players',
        'nashville predators players',
        'new jersey devils players',
        'new york americans players',
        'new york islanders players',
        'new york rangers players',
        'oakland seals players',
        'ottawa senators (1917) players',
        'ottawa senators players',
        'philadelphia flyers players',
        'philadelphia quakers (nhl) players',
        'phoenix coyotes players',
        'pittsburgh penguins players',
        'pittsburgh pirates (nhl) players',
        'quebec bulldogs players',
        'quebec nordiques players',
        'san jose sharks players',
        'seattle kraken players',
        'st. louis blues players',
        'st. louis eagles players',
        'tampa bay lightning players',
        'toronto arenas players',
        'toronto maple leafs players',
        'toronto st. pats players',
        'vancouver canucks players',
        'vegas golden knights players',
        'washington capitals players',
        'winnipeg jets (1979–1996) players',
        'winnipeg jets players',
      ],
      patterns: [/ice hockey players/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['ice_hockey_player', 'hockey_team_player'],
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
  };

  var Athlete = {
    name: 'Athlete',
    //
    children: {
      AmericanFootballPlayer,
      BaseballPlayer,
      FootballPlayer,
      BasketballPlayer,
      HockeyPlayer,
    },
    //
    categories: {
      mapping: [],
      patterns: [/sportspeople from ./, /(footballers|cricketers|defencemen|cyclists)/],
    },
    //
    descriptions: {
      patterns: [/(hockey|soccer|backetball|football) player/],
    },
    //
    infoboxes: {
      mapping: [
        'afl_biography',
        'alpine_ski_racer',
        'athlete',
        'baseball_biography',
        'basketball_biography',
        'boxer',
        'cfl_player',
        'cricketer',
        'cyclist',
        'field_hockey_player',
        'figure_skater',
        'football_biography',
        'gaa_player',
        'golfer',
        'gymnast',

        'lacrosse_player',
        'martial_artist',
        'mlb_player',
        'nba_biography',
        'nfl_biography',
        'nfl_player',
        'professional_wrestler',
        'rugby_biography',
        'rugby_league_biography',
        'skier',
        'squash_player',
        'swimmer',
        'tennis_biography',
        'volleyball_biography',
        'volleyball_player',
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
      patterns: [/sport-bio-stub$/],
    },
    //
    titles: {
      mapping: [
        'american football player',
        'football player',
        'gaelic footballer',
        'athlete',
        'boxer',
        'cricketer',
        'footballer',
        'wrestler',
        'golfer',
        'swimmer',
      ],
      patterns: [],
    },
  };

  var Politician = {
    name: 'Politician',
    //
    children: {},
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
        /. politicians$/, //democrats|republicans
        /mayors of ./,
      ],
    },
    //
    descriptions: {
      patterns: [/(politician|member of parliament)/],
    },
    //
    infoboxes: {
      // transcluded to officeholder
      mapping: [
        'am',
        'ambassador',
        'canadian_mp',
        'canadian_politician',
        'canadian_senator',
        'canadianmp',
        'canadiansenator',
        'candidate',
        'chairman',
        'chancellor',
        'chief_executive',
        'chief_justice',
        'civil_servant',
        'congressional_candidate',
        'congressman',
        'congressperson',
        'congresswoman',
        'defence_minister',
        'defense_minister',
        'deputy_first_minister',
        'deputy_prime_minister',
        'doge',
        'eritrea_cabinet_official',
        'first_gentleman',
        'first_lady',
        'first_minister',
        'general_secretary',
        'governor_general',
        'governor-elect',
        'governor-general',
        'governor',
        'indian_government_official',
        'indian_politician',
        'league_commissioner',
        'lt_governor',
        'mayor',
        'member_of_parliament',
        'member_of_state_duma',
        'mep',
        'mla',
        'mp',
        'mpp',
        'msp',
        'new_york_state_senator',
        'office_holder',
        'officeholder_infobox',
        'officeholder',
        'ontariompp',
        'people\'s_deputy',
        'pm',
        'politician_(general)',
        'politician_basic',
        'politician_infobox',
        'politician',
        'politicien',
        'premier',
        'president-elect',
        'president',
        'prime_minister-elect',
        'prime_minister',
        'quebecmna',
        'representative_elect',
        'representative-elect',
        'roman_emperor',
        'royalofficeholder',
        'scc_chief_justice',
        'scc_puisne_justice',
        'second_gentleman',
        'second_lady',
        'secretary-general',
        'secretary',
        'senator-elect',
        'senator',
        'speaker',
        'spouse_of_the_president',
        'spouse_of_the_vice_president',
        'state_representative',
        'state_sc_associate_justice',
        'state_sc_justice',
        'state_senator',
        'ukrainian_legislative_office',
        'university_chancellor',
        'university_president',
        'university_pro-chancellor',
        'university_rector',
        'university_vice-chancellor',
        'uruguayan_politician',
        'us_ambassador',
        'us_associate_justice',
        'us_cabinet_official',
        'us_chief_justice',
        'us_territorial_governor',
        'vice_president',
        'vice-president',
        'welsh_assembly_member',
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
  };

  var Actor = {
    name: 'Actor',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/(actors|actresses)/i],
    },
    //
    descriptions: {
      patterns: [/(actor|actress)/],
    },
    //
    infoboxes: {
      mapping: ['actor'],
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
      patterns: [/actor-stub$/],
    },
    //
    titles: {
      mapping: ['actor', 'actress'],
      patterns: [],
    },
  };

  var Musician = {
    name: 'Musician',
    //
    children: {},
    //
    categories: {
      mapping: [
        'american male guitarists',
        'american singer-songwriters',
        'american male singers',
        'american rock singers',
        'american rock guitarists',
        '21st-century american singers',
        'lead guitarists',
        'african-american musicians',
        'english male singers',
        'american male singer-songwriters',
        'american rock songwriters',
        'american record producers',
        'american country singer-songwriters',
        '20th-century american guitarists',
        'english songwriters',
        '20th-century american pianists',
        'songwriters from new york (state)',
        'african-american singers',
        'american blues singers',
        'american pop singers',
        'male guitarists',
        'american country singers',
        'blues hall of fame inductees',
        'american male songwriters',
        'songwriters from california',
        'english rock guitarists',
        'american folk singers',
        'english rock singers',
        'english singer-songwriters',
        'african-american male rappers',
        'african-american jazz musicians',
        '20th-century english singers',
        'american female singer-songwriters',
        'jewish american musicians',
        'american blues guitarists',
        '20th-century conductors (music)',
        'american female singers',
        'american jazz bandleaders',
        'american jazz pianists',
        'american soul singers',
        'american female guitarists',
        'american multi-instrumentalists',
        'american country guitarists',
        'english record producers',
        'songwriters from texas',
        'american composers',
        'singers from california',
        'american folk guitarists',
        'lgbt singers',
        'american buskers',
        'guitarists from california',
        'feminist musicians',
        'big band bandleaders',
        '20th-century composers',
        'african-american songwriters',
        'british rhythm and blues boom musicians',
        'alternative rock singers',
        '21st-century american guitarists',
        'american alternative rock musicians',
        'musicians from los angeles',
        'rhythm guitarists',
        'american session musicians',
        'jazz musicians from new orleans',
        'alternative rock guitarists',
        '20th-century women musicians',
        'male film score composers',
        'african-american singer-songwriters',
        'american jazz singers',
        '21st-century english singers',
        'singers from new york city',
        'american acoustic guitarists',
        'musicians from new york city',
        'slide guitarists',
        'guitarists from texas',
        'vaudeville performers',
        'classical composer',
      ],
      patterns: [/musicians from ./, /(singers|songwriters)/],
    },
    //
    descriptions: {
      patterns: [/(singer|musicianrapper|drummer)/, /(keyboard|guitar|bass) player/],
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
      patterns: [/(musician|singer)-stub$/],
    },
    //
    titles: {
      mapping: ['composer', 'musician', 'rapper', 'singer'],
      patterns: [],
    },
  };

  var Author = {
    name: 'Author',
    //
    children: {},
    //
    categories: {
      mapping: [
        '20th-century american novelists',
        'american male novelists',
        '21st-century american novelists',
        'american film producers',
        'american male screenwriters',
        'american science fiction writers',
        '20th-century english novelists',
        'english male poets',
        'american male short story writers',
        'american political writers',
        'english male novelists',
        '20th-century american writers',
        '19th-century male writers',
        'american male writers',
        '20th-century women writers',
        '20th-century male writers',
        'german male writers',
        '21st-century american writers',
        'french male writers',
        'jewish american writers',
        'writers from new york city',
        '21st-century women writers',
        'english male writers',
        'academic',
        'art historian',
        'economist',
        'philosopher',
        'theologian',
      ],
      patterns: [/novelists from ./],
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
  };

  var Director = {
    name: 'Director',
    //
    children: {},
    //
    categories: {
      mapping: ['directors of palme d\'or winners', 'best director aacta international award winners'],
      patterns: [/film directors/i],
    },
    //
    descriptions: {
      patterns: [/director/],
    },
    //
    infoboxes: {
      mapping: ['director'],
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
      patterns: [/director-stub$/],
    },
    //
    titles: {
      mapping: ['director'],
      patterns: [],
    },
  };

  var Creator = {
    name: 'Creator',
    //
    children: {
      Actor,
      Musician,
      Author,
      Director,
    },
    //
    categories: {
      mapping: ['fellows of the royal society'],
      patterns: [/(engineers|inventors|artists|painters|sculpters|choreographers)/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'artist',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [],
      patterns: [/filmography/, /bibliography/, /collaberators/, /early influences/, /discovery/],
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
  };

  var Person = {
    name: 'Person',
    children: {
      Athlete,
      Creator,
      Politician,
    },
    //
    categories: {
      mapping: [
        'living people',
        'possibly living people',
        'year of birth unknown',
        'members of the privy council of the united kingdom',
        'american people of english descent',
        'guggenheim fellows',
        'harvard university alumni',
        'american military personnel of world war ii',
        'knights bachelor',
        'american roman catholics',
        'knights of the garter',
        'presidential medal of freedom recipients',
        'commanders of the order of the british empire',
        'people educated at eton college',
        'alumni of trinity college, cambridge',
        'foreign members of the royal society',
        'american people of scottish descent',
        'american memoirists',
        'members of the french academy of sciences',
        'united states army soldiers',
        'officers of the order of the british empire',
        'deaths from pneumonia',
        'burials at père lachaise cemetery',
        'deaths from cancer in california',
        'year of birth missing (living people)',
        'knights of the golden fleece',
        'columbia university alumni',
        'alumni of the university of edinburgh',
        'american people of russian-jewish descent',
        'yale university alumni',
        'american atheists',
        'people of the tudor period',
        'tony award winners',
        'members of the académie française',
        'united states army officers',
        'persons of national historic significance (canada)',
        '20th-century american businesspeople',
        'american television producers',
        'american journalists',
        'american male journalists',
        'american male comedians',
        'princeton university alumni',
        'university of paris alumni',
        'american episcopalians',
        'american women novelists',
        'phi beta kappa members',
        '20th-century american poets',
        'bafta winners (people)',
        "members of the queen's privy council for canada",
        'american presbyterians',
        'fellows of the american academy of arts and sciences',
        'members of the united states national academy of sciences',
        'members of the royal swedish academy of sciences',
        '20th-century american short story writers',
        'american nobel laureates',
        'harvard university faculty',
        'roman catholic monarchs',
        'popes',
        'italian popes',
        // redirects to infobox person
        'actor voice',
        'actor',
        'actress',
        'adult biography',
        'adult female',
        'adult male',
        'architect',
        'astronaut',
        'aviator',
        'bio',
        'biography',
        'celebrity',
        'chef',
        'clergy',
        'criminal',
        'dancer',
        'director',
        'engineer',
        'entertainer',
        'fashion designer',
        'film actor',
        'film director',
        'human being',
        'human',
        'indian businessmen',
        'journalist',
        'medical person',
        'model',
        'pageant titleholder',
        'people',
        'performer',
        'person ii',
        'person',
        'person/measurements',
        'personality',
        'personbox',
        'photographer',
        'pirate',
        'police officer',
        'presenter',
        'professional bowler',
        'real person',
        'scientist',
        'sports announcer',
        'spy',
        'student',
        'trade unionist',
        'victim',
      ],
      patterns: [
        /[0-9]{4} births/,
        /[0-9]{4} deaths/,
        /people of .* descent/,
        /^deaths from /,
        /^(people|philanthropists|writers) from ./,
        / (players|alumni)$/,
        /(alumni|fellows) of .$/,
        /(people|writer) stubs$/,
        /(american|english) (fe)?male ./,
        /(american|english) (architects|people)/,
      ],
    },
    //
    descriptions: {
      patterns: [/(artist|painter|poet|writer|celebrity|activist)/],
    },
    //
    infoboxes: {
      mapping: [

        'adult_biography',
        'archbishop',
        'architect',
        'astronaut',
        'bishop',
        'chef',
        'chess_player',
        'chinese-language_singer_and_actor',
        'christian_leader',
        'coa_wide',
        'college_coach',
        'college_football_player',
        'comedian',
        'comics_creator',
        'criminal',
        'economist',
        'engineer',
        'f1_driver',
        'fashion_designer',
        'gridiron_football_person',
        'handball_biography',
        'hindu_leader',
        'horseracing_personality',
        'judge',
        'mass_murderer',
        'medical_person',
        'military_person',
        'minister',
        'model',
        'monarch',
        'nascar_driver',
        'pageant_titleholder',
        'person',
        'philosopher',
        'police_officer',
        'presenter',
        'racing_driver',
        'religious_biography',
        'royalty',
        'saint',
        'scholar',
        'scientist',
        'snooker_player',
        'sportsperson',
        'wrc_driver',
        'writer',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'early life',
        'personal life',
        'career',
        'career statistics',
        'playing career',
        'life and career',
        'early life and education',
        'film and television credits',
        'filmography',
        'selected filmography',
        'works',
        'life',
        'family',
        'political career',
        'early career',
        'later life',
        'early life and career',
        'later years',
        'death and legacy',
        'work',
        'novels',
        'later career',
        'international',
        'selected works',
        'writings',
        'professional career',
        'retirement',
        'poetry',
        'marriage',
        'electoral history',
        'military career',
        'international career',
        'parliamentary career',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: [
        'persondata',
        'writer',
        'ted speaker',
        's-aft',
        's-bef',
        's-start',
        'marriage',
        's-off',
        's-par',
        'internet archive author',
        'ribbon devices',
        's-reg',
        'find a grave',
        'gutenberg author',
        's-new',
        'other people',
        'medalgold',
        'medal',
        'mlby',
        's-vac',
        's-hou',
        'librivox author',
        'blp sources',
        's-ppo',
        'nbay',
      ],
      patterns: [/-bio-stub$/],
    },
    //
    titles: {
      mapping: [
        'murder victim',
        'academic',
        'author',
        'businessman',
        'cyclist',
        'diplomat',
        'director',
        'drummer',
        'journalist',
        'judge',
        'minister',
        'poet',
        'priest',
        'american football',
        'ice hockey',
        'soccer',
        'rugby league',
        'rugby union',
        'field hockey',
        'tennis',
        'writer',
        'vc',
        'racing driver',
        'architect',
        'comedian',
        'british army officer',
        'general',
        'broadcaster',
        'engineer',
        'physician',
        'soldier',
        'royal navy officer',
        'producer',
        'lawyer',
        'activist',
        'inventor',

        'artist',
        'painter',
        'cartoonist',
        'novelist',
        'photographer',
        'playwright',
        'bishop',
        'theologian',
        'historian',
        'philosopher',
        'mathematician',
        'astronomer',
        'economist',
      ],
      patterns: [],
    },
  };

  var City = {
    name: 'City',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [
        /^cities and towns in ./,
        /(^former )(municipalities|settlements|villages|localities|townships) in ./,
      ],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'swiss_town',
        'city_japan',
        'municipality_br',
        'russian_town',
        'south_african_town_2011',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'sister cities',
        'neighbourhoods',
        'churches',
        'parks and recreation',
        'public transportation',
      ],
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
  };

  var Country = {
    name: 'Country',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [],
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
      mapping: ['international relations'],
      patterns: [],
    },
    //
    templates: {
      mapping: [],
      patterns: [],
    },
    //
    titles: {
      mapping: ['country'],
      patterns: [],
    },
  };

  var Jurisdiction = {
    name: 'Jurisdiction',
    children: {
      City,
      Country
    },
    //
    categories: {
      mapping: [],
      patterns: [],
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
      mapping: [
        '2010 census',
        '2000 census',
        'economy',
        'transportation',
        'government',
        'communities',
        'transport',
        'culture',
        'sports',
        'adjacent counties',
        'major highways',
        'notable residents',
        'tourism',
        'cities',
        'population',
        'unincorporated communities',
        'infrastructure',
        'schools',
        'rail',
        'census-designated places',
        'towns',
        'local government',
        'points of interest',
        'attractions',
        'demographics',
        'climate',
        'notable people',
        'townships',
        'recreation',
        'arts and culture',
        'governance',
        'administrative divisions',
        'landmarks',
        'demography',
      ],
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
  };

  var Bridge = {
    name: 'Bridge',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [],
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
  };

  var Airport = {
    name: 'Airport',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [],
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
  };

  var Structure = {
    name: 'Structure',
    //
    children: {
      Bridge,
      Airport
    },
    //
    categories: {
      mapping: [],
      patterns: [
        /(buildings|bridges) completed in /,
        /airports established in ./,
        /(airports|bridges) in ./,
        /buildings and structures in ./,
      ],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'airport',
        'bridge',
        'building',
        'lighthouse',
        'military_structure',
        'power_station',
        'religious_building',
        'shopping_mall',
        'stadium',
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
  };

  var BodyOfWater = {
    name: 'BodyOfWater',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/(rivers|lakes|tributaries) of ./],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['body_of_water', 'lake', 'river', 'sea'],
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
      patterns: [/-river-stub$/],
    },
    //
    titles: {
      mapping: ['river'],
      patterns: [],
    },
  };

  var Place = {
    name: 'Place',
    children: {
      Jurisdiction,
      Structure,
      BodyOfWater,
    },
    //
    categories: {
      mapping: [],
      patterns: [
        /populated places/,
        /landforms of ./,
        /railway stations/,
        /parks in ./,
        / district$/,
        /geography stubs$/,
        /sports venue stubs$/,
      ],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'amusement_park',
        'ancient_site',
        'australian_place',
        'belgium_municipality',
        'canada_electoral_district',
        'casino',
        'cemetery',
        'church',
        'cricket_ground',
        'dam',
        'ecoregion',
        'feature_on_mars',
        'finnish_municipality/population_count',
        'former_country',
        'former_subdivision',
        'french_commune',
        'gb_station',
        'geobox',
        'german_location',
        'golf_facility',
        'greek_dimos',
        'historic_site',
        'historic_subdivision',
        'hospital',
        'hotel',
        'islands',
        'israel_village',
        'italian_comune',
        'kommune',
        'launch_pad',
        'london_station',
        'lunar_crater',
        'military_memorial',
        'monument',
        'mountain_pass',
        'mountain_range',
        'mountain',
        'neighborhood_portland_or',
        'nycs',
        'oil_field',
        'park',
        'prison',
        'province_or_territory_of_canada',
        'road_small',
        'road',
        'russian_inhabited_locality',
        'russian_urban-type_settlement',
        'scotland_council_area',
        'settlement',
        'south_african_subplace_2011',
        'state',
        'station',
        'street',
        'temple',
        'theatre',
        'town_at',
        'u.s._congressional_district',
        'u.s._county',
        'u.s._metropolitan_area',
        'u.s._state',
        'uk_constituency_main',
        'uk_constituency',
        'uk_disused_station',
        'uk_place',
        'uk_station',
        'unesco_world_heritage_site',
        'university_of_notre_dame_residence_hall',
        'venue',
        'waterfall',
        'windmill',
        'world_heritage_site',
        'zoo',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: ['geography', 'geology', 'location', 'coat of arms'],
      patterns: [],
    },
    //
    templates: {
      mapping: [
        'coord',
        'weather box',
        'us census population',
        'jct',
        'geographic location',
        'representative',
        'historical populations',
        'wikivoyage-inline',
        'election box',
        'zh',
        'wide image',
      ],
      patterns: [/-geo-stub$/],
    },
    //
    titles: {
      mapping: [
        'cape verde',
        'cedar busway station',
        'delhi metro',
        'erie county, new york',
        'new jersey',
        'new orleans',
        'new york City Subway',
        'new york',
        'new zealand',
        'north carolina',
        'northern ireland',
        'sri lanka',
        'uk parliament constituency',
        'united kingdom',
        'united states',
        'alaska',
        'argentina',
        'arkansas',
        'australia',
        'barbados',
        'brazil',
        'california',
        'canada',
        'chad',
        'chicago',
        'colombia',
        'connecticut',
        'dominica',
        'edmonton',
        'france',
        'georgia',
        'india',
        'israel',
        'japan',
        'manhattan',
        'michigan',
        'nigeria',
        'oklahoma',
        'ontario',
        'pennsylvania',
        'portugal',
        'province',
        'spain',
        'sudan',
        'texas',
        'uk',
        'va',
        'Virginia',
        'volcano',
        'washington',
      ],
      patterns: [],
    },
  };

  var MusicalGroup = {
    name: 'MusicalGroup',
    //
    children: {},
    //
    categories: {
      mapping: [
        'musical quartets',
        'musical duos',
        'musical trios',
        'musical quintets',
        'english rock music groups',
        'english new wave musical groups',
        'african-american musical groups',
        '21st-century american musicians',
        'american alternative metal musical groups',
        'english pop music groups',
        'art rock musical groups',
        'english post-punk music groups',
      ],
      patterns: [
        /musical groups from /,
        /musical groups (dis)?established in [0-9]{4}/,
        /musical group stubs/,
        /. music(al)? (groups|duos|trios|quartets|quintets)$/,
      ],
    },
    //
    descriptions: {
      patterns: [/rock band/],
    },
    //
    infoboxes: {
      mapping: ['musical_artist', 'marching_band'],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'band members',
        'albums',
        'studio albums',
        'compilation albums',
        'live albums',
        'compilations',
        'eps',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: ['allmusic'],
      patterns: [],
    },
    //
    titles: {
      mapping: [
        'band',
        'american band',
        'australian band',
        'canadian band',
        'uk band',
        'japanese band',
        'swedish band',
      ],
      patterns: [],
    },
  };

  var Company = {
    name: 'Company',
    //
    children: {},
    //
    categories: {
      mapping: [
        'companies listed on the new york stock exchange',
        'jazz record labels',
        'video game development companies',
        'american record labels',
        'companies listed on nasdaq',
        'video game companies of the united states',
        'companies formerly listed on the london stock exchange',
        'multinational companies headquartered in the united states',
        'companies listed on the tokyo stock exchange',
        're-established companies',
        'companies based in new york city',
        'defunct video game companies',
        'companies formed by merger',
        'entertainment companies based in california',
        'acquisition',
      ],
      patterns: [/companies (established|based) in ./],
    },
    //
    descriptions: {
      patterns: [/(company|subsidary)/],
    },
    //
    infoboxes: {
      mapping: [
        'advertising',
        'airline_alliance',
        'ambulance_company',
        'architectural_practice',
        'brand',
        'bus_company',
        'business_park',
        'central_bank',
        'certification_mark',
        'company',
        'company/unternehmen',
        'disney_resort',
        'economy',
        'exchange',
        'financial_index',
        'fishery',
        'industrial_process',
        'interbank_network',
        'law_firm',
        'livery_company',
        'loyalty_program',
        'mine',
        'mining',
        'occupation',
        'product',
        'property_development',
        'record_label',
        'restaurant',
        'television_channel',
        'television_station',
        'toy',
        'u.s._national_banks',
        'winery',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: ['products'],
      patterns: [],
    },
    //
    templates: {
      mapping: [],
      patterns: [/-company-stub$/],
    },
    //
    titles: {
      mapping: ['company', 'newspaper', 'restaurant', 'retailer', 'store'],
      patterns: [],
    },
  };

  var SportsTeam = {
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
        'baseball_team',
        'basketball_club',
        'college_baseball_team',
        'college_basketball_team',
        'college_cross_country_team',
        'college_fencing_team',
        'college_football_team',
        'college_golf_team',
        'college_gymnastics_team',
        'college_ice_hockey_team',
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
        'cricket_team',
        'football_club_infobox',
        'football_club',
        'hockey_team',
        'national_football_team',
        'non_test_cricket_team',
        'non-profit',
        'pro_hockey_team',
        'rugby_league_club',
        'rugby_league_representative_team',
        'rugby_team',
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
  };

  var PoliticalParty = {
    name: 'PoliticalParty',
    //
    children: {},
    //
    categories: {
      mapping: ['social democratic parties'],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [/political party/],
    },
    //
    infoboxes: {
      mapping: ['political_party'],
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
      mapping: ['political party'],
      patterns: [],
    },
  };

  var School = {
    name: 'School',
    //
    children: {},
    //
    categories: {
      mapping: [
        'land-grant universities and colleges',
      ],
      patterns: [
        /schools in ./,
        /(secondary|primary|high|elementary|public|private) schools/,
        /(schools|universities|colleges) established in [0-9]{4}/,
      ],
    },
    //
    descriptions: {
      patterns: [/(private|public|high|middle|elementary|primary|secondary) school/],
    },
    //
    infoboxes: {
      mapping: [
        'college',
        'school',
        'university',
        'residential_college',
        'law_school',
        'uk_school',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [],
      patterns: [/alumni/],
    },
    //
    templates: {
      mapping: [],
      patterns: [/-school-stub$/],
    },
    //
    titles: {
      mapping: [],
      patterns: [],
    },
  };

  var Organization = {
    name: 'Organization',
    //
    children: {
      MusicalGroup,
      Company,
      SportsTeam,
      PoliticalParty,
      School
    },
    //
    categories: {
      mapping: [
        'japanese brands',
        'american jazz composers',
        'scouting in the united states',
        'car brands',
        'government-owned airlines',
        'baptist denominations in north america',
        'baptist denominations established in the 20th century',
        'video game publishers',
        'defunct motor vehicle manufacturers of the united states',
        'alternative rock groups from california',
      ],
      patterns: [
        /(organi[sz]ations|publications) based in /,
        /(organi[sz]ations|publications|awards) established in [0-9]{4}/,
        /military units/,
        /magazines/,
        /organi[sz]ation stubs$/,
      ],
    },
    //
    descriptions: {
      patterns: [/(charity|organization|ngo)/],
    },
    //
    infoboxes: {
      mapping: [

        'airline',
        'athletic_conference',
        'brewery',
        'broadcasting_network',
        'bus_transit',
        'caste',
        'cbb_team',
        'choir',
        'christian_denomination',
        'clan',
        'court',
        'criminal_organization',
        'detention_facility',
        'diocese',
        'dot-com_company',
        'ethnic_group',
        'family',
        'fictional_organisation',
        'film_awards',
        'film_festival',
        'fire_department',
        'football_league',
        'former_monarchy',
        'fraternity',
        'gaa_club',
        'government_agency',
        'government_cabinet',
        'government',
        'grand_lodge',
        'hereditary_title',
        'india_university_ranking',
        'institute',
        'iwi',
        'journal',
        'laboratory',
        'law_enforcement_agency',
        'legislature',
        'library',
        // 'magazine',
        'military_gear',
        'military_rank',
        'military_unit',
        'monarchy',
        'monastery',
        'museum',
        'national_military',
        'ncaa_football_school',
        'newspaper',
        'nobility',
        'observatory',
        'order',
        'organization',
        'public_transit',
        'publisher',
        'radio_station',
        'rail_line',
        'rail_service',
        'rail',
        'religious_group',
        'school_district',
        'sg_rail',
        'space_agency',
        'sport_governing_body',
        'sports_league',
        'tribe',
        'tv_channel',
        'u.s._cabinet',
        'u.s._legislation',
        'uk_legislation',
        'uk_university_rankings',
        'union',
        'us_university_ranking',
        'v8_supercar_team',
        'website',
        'worldscouting',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'founding',
        'founders',
        'members',
        'athletics',
        'notable alumni',
        'academics',
        'campus',
        'organization',
        'student life',
        'rankings',
        'fleet',
        'research',
        'formation',
        'operations',
        'players',
        'alumni',
        'former members',
        'presidents',
        'membership',
        'current members',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: ['composition bar', 'fs player', 'y', 'n', 'rws'],
      patterns: [],
    },
    //
    titles: {
      mapping: [
        'group',
        'journal',
        'am',
        'fm',
        'wehrmacht',
        'tv channel',
        'british band',
        'organization',
        'airline',
        'publisher',
        'brand',
        'record label',
        'union army',
        'defunct',
        'tv network',
        'department store',
      ],
      patterns: [],
    },
  };

  var Disaster = {
    name: 'Disaster',
    children: {},
    //
    categories: {
      mapping: ['retired atlantic hurricanes'],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'aircraft_accident',
        'airliner_accident',
        'earthquake',
        'hurricane',
        'pandemic',
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
  };

  var Election = {
    name: 'Election',
    children: {},
    //
    categories: {
      mapping: ['presidential elections in ireland'],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['election'],
      patterns: [],
    },
    //
    sections: {
      mapping: [],
      patterns: [],
    },
    //
    templates: {
      mapping: ['election summary party with leaders'],
      patterns: [/-election-stub$/],
    },
    //
    titles: {
      mapping: [],
      patterns: [],
    },
  };

  var MilitaryConflict = {
    name: 'MilitaryConflict',
    children: {},
    //
    categories: {
      mapping: [
        'wars involving the united kingdom',
        'proxy wars',
        'new zealand wars',
        'battles between england and scotland',
        'conflicts in 1943',
        'last stand battles',
        'battles and conflicts without fatalities',
        'guerrilla wars',
        '20th-century conflicts',
        '20th-century revolutions',
        'sieges involving japan',
        'revolution-based civil wars',
      ],
      patterns: [/conflicts (in|of) [0-9]{4}/, /(wars|battles|conflicts) (involving|of|in) ./],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['military_conflict', 'civilian_attack'],
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
  };

  var SportsEvent = {
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
  };

  var Event = {
    name: 'Event',
    children: {
      Disaster,
      Election,
      MilitaryConflict,
      SportsEvent,
    },
    //
    categories: {
      mapping: [
        'years in literature',
        'years in music',
        'years in film',
        'united states supreme court cases',
        'leap years in the gregorian calendar',
        "governor general's awards",
        'eurovision song contest by year',
        'grammy awards ceremonies',
        'united kingdom in the eurovision song contest',
        'manned soyuz missions',
        'american civil liberties union litigation',
        'may',
        'october',
        'missions to the moon',
        'world war ii british commando raids',
        'july',
        'december',
        'september',
        'november',
        'january',
        'june',
        'august',
        'april',
        'february',
        'march',
        'conflicts in 1944',
        'missions to mars',
        'luna program',
        'conflicts in 1942',
        'special air service',
        'soft landings on the moon',
        'may observances',
        'first events',
        'recent years',
        'elections not won by the popular vote winner',
        'conflicts in 1864',
        '1862 in the american civil war',
        'new york (state) in the american revolution',
        'march observances',
        'public holidays in the united states',
        '1944 in france',
        'december observances',
        '20th century american trials',
        'african-american civil rights movement (1954–68)',
        'october observances',
        'spring holidays',
        'years in aviation',
        'national days',
        'summer holidays',
        'apollo program',
      ],
      patterns: [/^(19|20)[0-9]{2} in /, /^(years of the )?[0-9]{1,2}(st|nd|rd|th)? century in ./],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'australian_year',
        'beauty_pageant',
        'civil_conflict',
        'coa_case',
        'concert_tour',
        'court_case',
        'esc_national_year',
        'event',
        'grand_prix_motorcycle_race_report',
        'grand_prix_race_report',
        'historical_era',
        'historical_event',
        'holiday',
        'horseraces',
        'individual_darts_tournament',
        'individual_snooker_tournament',
        'indy500',
        'international_handball_competition',
        'international_labour_organization_convention',
        'legislative_term',
        'music_festival',
        'national_political_convention',
        'nfl_draft',
        'pba_draft',
        'reality_music_competition',
        'recurring_event',
        'referendum',
        'scotus_case',
        'song_contest',
        'summit',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'aftermath',
        'births',
        'deaths',
        'battle',
        'results',
        'prelude',
        'may',
        'june',
        'march',
        'december',
        'october',
        'july',
        'august',
        'april',
        'november',
        'february',
        'september',
        'january',
        'incumbents',
        'casualties',
        'july to december',
        'january to june',
        'medal table',
        'campaign',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: [
        'esc',
        'year nav',
        'year dab',
        'goal',
        'flagiocmedalist',
        'm1 year in topic',
        'year nav topic5',
        'bc year in topic',
        'flagiocathlete',
        'year article header',
      ],
      patterns: [],
    },
    //
    titles: {
      mapping: ['festival', '25 m', 'world war ii', 'conmebol', 'music festival', 'world war i'],
      patterns: [/ \((19|20)[0-9]{2}\)$/],
    },
  };

  var Album = {
    name: 'Album',
    children: {},
    //
    categories: {
      mapping: ['albums recorded at abbey road studios'],
      patterns: [/[0-9]{4}.*? albums/, /^albums /, / albums$/, /album stubs$/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['album'],
      patterns: [],
    },
    //
    sections: {
      mapping: ['track listing'],
      patterns: [],
    },
    //
    templates: {
      mapping: ['track listing', 'tracklist'],
      patterns: [/-album-stub$/],
    },
    //
    titles: {
      mapping: ['album'],
      patterns: [],
    },
  };

  var Book = {
    name: 'Book',
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/(film|novel) stubs$/, /[0-9]{4}.*? (poems|novels)/, / (poems|novels)$/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['book'],
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
      patterns: [/-novel-stub$/],
    },
    //
    titles: {
      mapping: ['book', 'novel'],
      patterns: [],
    },
  };

  var Film = {
    name: 'Film',
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/[0-9]{4}.*? films/, / films$/, /^films /],
    },
    //
    descriptions: {
      patterns: [/[0-9]{4} film/],
    },
    //
    infoboxes: {
      mapping: ['film'],
      patterns: [],
    },
    //
    sections: {
      mapping: ['cast'],
      patterns: [],
    },
    //
    templates: {
      mapping: ['imdb title', 'film date', 'rotten-tomatoes'],
      patterns: [/-film-stub$/],
    },
    //
    titles: {
      mapping: ['movie'],
      patterns: [/ \([0-9]{4} film\)$/],
    },
  };

  var TVShow = {
    name: 'TVShow',
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/television series/],
    },
    //
    descriptions: {
      patterns: [/television series/],
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
      mapping: ['episode list'],
      patterns: [],
    },
    //
    titles: {
      mapping: [
        'tv series',
        'game show',
        'u.s. tv series',
        'uk tv series',
        'australian tv series',
        'u.s. game show',
      ],
      patterns: [],
    },
  };

  var Play = {
    name: 'Play',
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['play'],
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
      patterns: [/-play-stub$/],
    },
    //
    titles: {
      mapping: ['play'],
      patterns: [],
    },
  };

  var Song = {
    name: 'Song',
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/[0-9]{4}.*? songs/, /^songs /, / songs$/, /song stubs$/],
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
      mapping: ['song'],
      patterns: [],
    },
  };

  var VideoGame = {
    name: 'VideoGame',
    children: {},
    //
    categories: {
      mapping: [
        'dos games',
        'virtual console games',
        'mac os games',
        'amiga games',
        'arcade games',
        'commodore 64 games',
        'nintendo entertainment system games',
        'playstation (console) games',
        'ios games',
        'super nintendo entertainment system games',
        'video game sequels',
        'game boy advance games',
        'first-person shooters',
        'playstation network games',
        'linux games',
        'atari st games',
        'playstation 2 games',
        'game boy games',
        'zx spectrum games',
        'mario universe games',
        'multiplayer online games',
        'mobile games',
        'android (operating system) games',
        'platform games',
        'xbox 360 live arcade games',
        'sega genesis games',
      ],
      patterns: [/video games/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['video_game'],
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
      mapping: ['video game'],
      patterns: [],
    },
  };

  var CreativeWork = {
    name: 'CreativeWork',
    children: {
      Album,
      Book,
      Film,
      TVShow,
      Play,
      Song,
      VideoGame,
    },
    //
    categories: {
      mapping: [
        'operas',
        'american science fiction novels',
        'broadway musicals',
        'debut novels',
        'the twilight zone (1959 tv series) episodes',
        'united states national recording registry recordings',
        'macos games',
        'virtual console games for wii u',
        'american monthly magazines',
        'broadway plays',
        'interactive achievement award winners',
        'doubleday (publisher) books',
        '19th-century classical composers',
        'film soundtracks',
        'universal deluxe editions',
        'best picture academy award winners',
        'shōnen manga',
        'west end musicals',
        'sequel novels',
        'dystopian novels',
        'american comic strips',
        'american road movies',
        'chemical elements',
        'amstrad cpc games',
        'neo-noir',
        'fiction with unreliable narrators',
        'best drama picture golden globe winners',
        'adventure anime and manga',
      ],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'animanga/other',
        'anthem',
        'artwork',
        'audio_drama',
        'big_finish',
        'book_series',
        'broadcast',
        'comic_book_title',
        'comic_strip',
        'comics_character_and_title',
        'comics_meta_series',
        'comics_organization',
        'comics_story_arc',
        'doctor_who_episode',
        'folk_tale',
        'futurama_episode',
        'graphic_novel',
        'hollywood_cartoon',
        'magazine',
        'media_franchise',
        'musical_composition',
        'musical',
        'name_module',
        'opera',
        'painting',
        'radio_show',
        'rpg',
        'short_story',
        'simpsons_episode',
        'song_contest_entry',
        'song',
        'sw_comics',
        'television_episode',
        'television_season',
        'the_goodies_episode',
        'treaty',
        'vg_series',
        'video_game_series',
        'webcomic',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'plot',
        'reception',
        'charts',
        'release',
        'plot summary',
        'gameplay',
        'characters',
        'box office',
        'accolades',
        'soundtrack',
        'adaptations',
        'synopsis',
        'home media',
        'weekly charts',
        'themes',
        'publication history',
        'filming',
        'year-end charts',
        'casting',
        'release and reception',
        'commercial performance',
        'composition',
        'album',
        'setting',
        'chart positions',
        'release history',
        'charts and certifications',
        'sequels',
        'chart performance',
        'sequel',
        'recordings',
        'story',
        'editions',
        'in other media',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: [
        'rating',
        'certification table entry',
        'albumchart',
        'music',
        'album ratings',
        'album chart',
        'singles',
        'isbnt',
        'singlechart',
        'tcmdb title',
        'mojo title',
        'based on',
        'amg movie',
        'duration',
      ],
      patterns: [/-song-stub$/],
    },
    //
    titles: {
      mapping: [
        'season 2',
        'season 3',
        'season 4',
        'season 5',
        'the twilight zone',
        'ballet',
        'magazine',
        'miniseries',
        'music',
        'opera',
        'painting',
        'series',
        'single',
        'song',
        'soundtrack',
        'ep',
        'comics',
        'musical',
        'manga',
        'star trek: the next generation',
        'star trek: deep space nine',
        'buffy the vampire slayer',
        'angel',
        'the outer limits',
        'star trek: voyager',
        'short story',
        'seinfeld',
        'star trek: enterprise',
        'poem',
        'tv',
        'uk series',
        'doctor who',
        'david bowie song',
        'caravaggio',
        'the beach boys song',
        'video',
        'audio drama',
        'babylon 5',
        'madonna song',
      ],
      patterns: [/ \((.*? )song\)$/],
    },
  };

  var Product = {
    name: 'Product',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/products introduced in ./, /musical instruments/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'automobile',
        'beverage',
        'cpu',
        'electric_vehicle',
        'gpu',
        'mobile_phone',
        'motorcycle',
        'synthesizer',
        'television',
        'card_game',
        'computer',
        'laboratory_equipment',
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
      mapping: ['computer game', 'candy', 'board game', 'card game', 'automobile'],
      patterns: [],
    },
  };

  var FictionalCharacter = {
    name: 'FictionalCharacter',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [/(fictional|television) characters/],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'animanga_character',
        'character',
        'comics_character',
        'd&d_creature',
        'doctor_who_character',
        'mythical_creature',
        'soap_character',
        'tolkien_character',
        'vg_character',
        'video_game_character',
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
      mapping: ['character'],
      patterns: [],
    },
  };

  var Creation = {
    name: 'Creation',
    children: {
      CreativeWork,
      Product,
      FictionalCharacter
    },
    //
    categories: {
      mapping: [],
      patterns: [],
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
  };

  var MedicalCondition = {
    name: 'MedicalCondition',
    //
    children: {},
    //
    categories: {
      mapping: [],
      patterns: [],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: ['medical_condition_(new)', 'medical_condition', 'disease'],
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
  };

  var Organism = {
    name: 'Organism',
    //
    children: {},
    //
    categories: {
      mapping: [
        'agamidae',
        'american inventions',
        'angiosperm orders',
        'animal dance',
        'animal phyla',
        'berries',
        'bird families',
        'birds by common name',
        'calidris',
        'cimolodonts',
        'commercial fish',
        'corvus (genus)',
        'cretaceous mammals',
        'crops originating from the americas',
        'crops',
        'ducks',
        'edge species',
        'edible nuts and seeds',
        'entheogens',
        'epiphytic orchids',
        'flowers',
        'fruits originating in asia',
        'geckos',
        'geese',
        'herbs',
        'indian spices',
        'insects in culture',
        'invasive plant species',
        'leaf vegetables',
        'living fossils',
        'mammal families',
        'marine edible fish',
        'megafauna',
        'multituberculates',
        'non-timber forest products',
        'ornamental trees',
        'paleocene genus extinctions',
        'paleocene mammals',
        'phelsuma',
        'pinus',
        'plants and pollinators',
        'ptilodontoids',
        'root vegetables',
        'setophaga',
        'shorebirds',
        'skinks',
        'spices',
        'taxa named by carl linnaeus',
        'taxa named by john edward gray',
        'taxa named by leopold fitzinger',
        'tropical agriculture',
        'tropical fruit',
        'urban animals',
      ],
      patterns: [
        /(funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants) of ./,
        / first appearances/,
        / . described in [0-9]{4}/,
        /. (phyla|genera)$/,
        /. taxonomic families$/,
        /plants used in ./,
        / (funghi|reptiles|flora|fauna|fish|birds|trees|mammals|plants)$/,
      ],
    },
    //
    descriptions: {
      patterns: [],
    },
    //
    infoboxes: {
      mapping: [
        'speciesbox',
        'automatic_taxobox',
        'dogbreed',
        'dog_breed',
        'cat_breed',
        'grape_variety',
        'taxobox',
        'subspeciesbox',
        'mycomorphbox',
        'paraphyletic_group',
        'nutritional_value',
        'infraspeciesbox',
        'horse',
        'haplogroup',
        'bird',
        'bird/population',
        'medical_resources',
        'nc_name',
        'pig_breed',
        'botanical_product',
        'cattle_breed',
        'horse_breed',
        'poultry_breed',
      ],
      patterns: [],
    },
    //
    sections: {
      mapping: [
        'habitat',
        'morphology',
        'phylogeny',
        'distribution and diversity',
        'distribution and habitat',
        'reproduction and development',
        'taxonomy and phylogeny',
      ],
      patterns: [],
    },
    //
    templates: {
      mapping: [
        'taxonbar',
        'wikispecies',
        'animalia',
        'chordata',
        'cnidaria',
        'porifera',
        'epicaridea',
        'mammals',
        'phlyctaeniidae',
        'carnivora',
        'clade',
        'life on earth',
        'orders of insects',
        'coleoptera',
        'insects in culture',
        'living things in culture',
        'eukaryota classification',
        'iucn status',
        'extinct',
        'fossil range',
        'internetbirdcollection',
        'vireo',
        'angle bracket',
        'wikispecies-inline',
        'iucn map',
        'xeno-canto species',
        'avibase',
        'cladex',
        'birdlife',
        'fossilrange',
      ],
      patterns: [],
    },
    //
    titles: {
      mapping: ['plant', 'genus', 'fish', 'bird'],
      patterns: [],
    },
  };

  var Concept = {
    name: 'Concept',
    children: {
      MedicalCondition,
      Organism,
    },
    //
    categories: {
      mapping: [],
      patterns: [],
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
  };

  let schema = {
    children: {
      Person,
      Place,
      Organization,
      Event,
      Creation,
      Concept
    },
  };

  // generate slash-based ids by descending recursively
  const setId = function (root, id) {
    if (root.name) {
      root.id = id + '/' + root.name;
    } else {
      root.id = '';
    }
    if (root.children) {
      Object.keys(root.children).forEach((k) => {
        setId(root.children[k], root.id);
      });
    }
    return root
  };

  schema = setId(schema, '');

  var schema$1 = schema;

  let mappings = {
    categories: {},
    descriptions: {},
    infoboxes: {},
    sections: {},
    templates: {},
    titles: {},
  };
  let patterns = {
    categories: [],
    descriptions: [],
    infoboxes: [],
    sections: [],
    templates: [],
    titles: [],
  };

  const doNode = function (node) {
    // try children patterns first
    if (node.children) {
      Object.keys(node.children).forEach((k) => {
        doNode(node.children[k]);
      });
    }
    if (node.id) {
      // collect mappings
      node.categories.mapping.forEach((str) => {
        mappings.categories[str] = node.id;
      });
      node.descriptions.mapping = node.descriptions.mapping || [];
      node.descriptions.mapping.forEach((str) => {
        mappings.descriptions[str] = node.id;
      });
      node.infoboxes.mapping.forEach((str) => {
        mappings.infoboxes[str] = node.id;
      });
      node.sections.mapping.forEach((str) => {
        mappings.sections[str] = node.id;
      });
      node.templates.mapping.forEach((str) => {
        mappings.templates[str] = node.id;
      });
      node.titles.mapping.forEach((str) => {
        mappings.titles[str] = node.id;
      });
      // collect patterns
      node.categories.patterns.forEach((reg) => {
        patterns.categories.push([reg, node.id]);
      });
      node.descriptions.patterns.forEach((reg) => {
        patterns.descriptions.push([reg, node.id]);
      });
      node.infoboxes.patterns.forEach((reg) => {
        patterns.infoboxes.push([reg, node.id]);
      });
      node.sections.patterns.forEach((reg) => {
        patterns.sections.push([reg, node.id]);
      });
      node.templates.patterns.forEach((reg) => {
        patterns.templates.push([reg, node.id]);
      });
      node.titles.patterns.forEach((reg) => {
        patterns.titles.push([reg, node.id]);
      });
    }


  };
  doNode(schema$1);

  const byInfobox = function (doc) {
    let infoboxes = doc.infoboxes();
    let found = [];
    for (let i = 0; i < infoboxes.length; i++) {
      let inf = infoboxes[i];
      let type = inf.type();

      type = type.toLowerCase();
      // type = type.replace(/^(category|categorie|kategori): ?/i, '')
      type = type.replace(/ /g, '_');
      type = type.trim();

      if (mappings.infoboxes.hasOwnProperty(type)) {
        found.push({ type: mappings.infoboxes[type], reason: type });
      }
    }
    return found
  };

  const byPattern = function (str, patterns) {
    for (let i = 0; i < patterns.length; i += 1) {
      let reg = patterns[i][0];
      if (reg.test(str) === true) {
        return patterns[i][1]
      }
    }
    return null
  };

  const byCategory = function (doc) {
    let found = [];
    let cats = doc.categories();
    // clean them up a bit
    cats = cats.map((cat) => {
      cat = cat.toLowerCase();
      cat = cat.replace(/^(category|categorie|kategori): ?/i, '');
      cat = cat.replace(/_/g, ' ');
      return cat.trim()
    });
    // loop through each
    for (let i = 0; i < cats.length; i++) {
      const category = cats[i];
      // try our 1-to-1 mapping
      if (mappings.categories.hasOwnProperty(category)) {
        found.push({ type: mappings.categories[category], reason: category });
        continue
      }
      // loop through our patterns
      let match = byPattern(category, patterns.categories);
      if (match) {
        found.push({ type: match, reason: category });
      }
    }
    return found
  };

  const byTemplate = function (doc) {
    let templates = doc.templates().map((tmpl) => tmpl.json());
    let found = [];
    for (let i = 0; i < templates.length; i++) {
      const title = templates[i].template;
      if (mappings.templates.hasOwnProperty(title)) {
        found.push({ type: mappings.templates[title], reason: title });
      } else {
        // try regex-list on it
        let type = byPattern(title, patterns.templates);
        if (type) {
          found.push({ type: type, reason: title });
        }
      }
    }
    return found
  };

  const fromSection = function (doc) {
    let found = [];
    let titles = doc.sections().map((s) => {
      let str = s.title();
      str = str.toLowerCase().trim();
      return str
    });
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      if (mappings.sections.hasOwnProperty(title)) {
        found.push({ type: mappings.sections[title], reason: title });
      }
    }
    return found
  };

  const paren$1 = /\((.*)\)$/;

  const byTitle = function (doc) {
    let title = doc.title();
    if (!title) {
      return []
    }
    //look at parentheses like 'Tornado (film)'
    let m = title.match(paren$1);
    if (!m) {
      return []
    }
    let inside = m[1] || '';
    inside = inside.toLowerCase();
    inside = inside.replace(/_/g, ' ');
    inside = inside.trim();

    //look at known parentheses
    if (mappings.titles.hasOwnProperty(inside)) {
      return [{ type: mappings.titles[inside], reason: inside }]
    }

    // look at regex
    let match = byPattern(title, patterns.titles);
    if (match) {
      return [{ type: match, reason: title }]
    }
    return []
  };

  const byDescription = function (doc) {
    let tmpl = doc.template('short description');
    if (tmpl && tmpl.description) {
      let desc = tmpl.description || '';
      desc = desc.toLowerCase();
      // loop through our patterns
      let match = byPattern(desc, patterns.descriptions);
      if (match) {
        return [{ type: match, reason: desc }]
      }
    }
    return []
  };

  const skip = {
    disambiguation: true,
    surname: true,
    name: true,
    'given name': true,
  };
  const paren = /\((.*)\)$/;
  const listOf = /^list of ./;
  const disambig = /\(disambiguation\)/;

  const skipPage = function (doc) {
    let title = doc.title() || '';

    //look at parentheses like 'Tornado (film)'
    let m = title.match(paren);
    if (!m) {
      return null
    }
    let inside = m[1] || '';
    inside = inside.toLowerCase();
    inside = inside.replace(/_/g, ' ');
    inside = inside.trim();

    //look at known parentheses
    if (skip.hasOwnProperty(inside)) {
      return true
    }
    //try a regex
    if (listOf.test(title) === true) {
      return true
    }
    if (disambig.test(title) === true) {
      return true
    }
    return false
  };

  const topk = function (arr) {
    let obj = {};
    arr.forEach((a) => {
      obj[a] = obj[a] || 0;
      obj[a] += 1;
    });
    let res = Object.keys(obj).map((k) => [k, obj[k]]);
    res = res.sort((a, b) => {
      if (a[1] > b[1]) {
        return -1
      } else if (a[1] < b[1]) {
        return 1
      }
      return 0
    });
    return res
  };

  const parse = function (cat) {
    let split = cat.split(/\//);
    return {
      root: split[1],
      second: split[2],
      third: split[3],
    }
  };

  const getScore = function (detail) {
    let types = [];
    Object.keys(detail).forEach((k) => {
      detail[k].forEach((obj) => {
        types.push(parse(obj.type));
      });
    });
    // find top parent
    let roots = types.map((obj) => obj.root).filter((s) => s);
    let tops = topk(roots);
    let top = tops[0];
    if (!top) {
      return {
        detail: detail,
        type: null,
        score: 0,
      }
    }
    let root = top[0];
    // score as % of results
    let score = top[1] / types.length;
    // punish low counts
    if (top[1] === 1) {
      score *= 0.75;
    }
    if (top[1] === 2) {
      score *= 0.85;
    }
    if (top[1] === 3) {
      score *= 0.95;
    }
    // if the second root is good
    if (tops[1]) {
      if (tops[1][1] === tops[0][1]) {
        score *= 0.5; //tie
      } else {
        score *= 0.8;
      }
    }

    // find 2nd level
    let children = types.filter((o) => o.root === root && o.second).map((obj) => obj.second);
    let topKids = topk(children);
    top = topKids[0];
    let second = null;
    let type = root;
    if (top) {
      second = top[0];
      type = `${root}/${second}`;
      // punish for any conflicting children
      if (topKids.length > 1) {
        score *= 0.7;
      }
      // punish for low count
      if (top[1] === 1) {
        score *= 0.8;
      }

      // try for 3rd level?
      if (second) {
        children = types.filter((o) => o.second === second && o.third).map((obj) => obj.third);
        topKids = topk(children);
        top = topKids[0];
        // type = root
        if (top) {
          type += `/${top[0]}`;
          // punish for any conflicting children
          if (topKids.length > 1) {
            score *= 0.7;
          }
          // punish for low count
          if (top[1] === 1) {
            score *= 0.8;
          }
        }

      }
    }
    return {
      root: root,
      type: type,
      score: score,
      details: detail,
    }
  };

  const plugin = function (models) {
    //add a new method to main class
    models.Doc.prototype.classify = function () {
      let doc = this;
      let res = {};

      //dont classify these
      if (skipPage(doc)) {
        return getScore(res)
      }

      //look for 'infobox person', etc
      res.infobox = byInfobox(doc);

      //look for '{{coord}}'
      res.template = byTemplate(doc);

      //look for '==early life=='
      res.section = fromSection(doc);

      //look for 'foo (film)'
      res.title = byTitle(doc);

      //look for 'foo (film)'
      res.description = byDescription(doc);

      //look for 'Category: 1992 Births', etc
      res.category = byCategory(doc);
      return getScore(res)
    };
  };

  return plugin;

}));
