const patterns = {
  FictionalCharacter: [/(fictional|television) characters/],
  Product: [/products introduced in ./, /musical instruments/],
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
  'Person/Artist': [/musicians from ./, /(singers|songwriters|painters|poets)/, /novelists from ./],
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
  'Place/Structure': [
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
    /musical groups (dis)?established in [0-9]{4}/,
    /musical group stubs/,
    /. music(al)? (groups|duos|trios|quartets|quintets)$/
  ],
  'Organization/SportsTeam': [
    /football clubs in ./,
    /(basketball|hockey|baseball|football) teams (in|established) ./
  ],
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
module.exports = patterns
