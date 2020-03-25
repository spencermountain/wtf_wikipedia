const patterns = {
  'Thing/Character': [/(fictional|television) characters/],
  'Thing/Product': [/products introduced in ./, /musical instruments/],
  'Thing/Organism': [
    /(funghi|reptiles|flora|fauna|fish|birds|trees) of ./,
    / first appearances/,
    / phyla/
  ],

  // ==Person==
  'Person/Politician': [
    /politicians from ./,
    /politician stubs$/,
    /. (democrats|republicans|politicians)$/,
    /mayors of ./
  ],
  'Person/Athlete': [/sportspeople from ./, /(footballers|cricketers|defencemen|cyclists)/],
  'Person/Actor': [/actresses/, /actors from ./, /actor stubs$/],
  'Person/Artist': [/musicians from ./, /(singers|songwriters|painters|poets)/, /novelists from ./],
  // 'Person/Scientist': [(astronomers|physicists|biologists|chemists)],
  Person: [
    /[0-9]{4} births/,
    /[0-9]{4} deaths/,
    /people of .* descent/,
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
  'CreativeWork/Album': [/[0-9]{4} albums/, /albums produced by /, / albums$/],
  'CreativeWork/Film': [/[0-9]{4} films/, / films$/],
  'CreativeWork/TVShow': [/television series/],
  CreativeWork: [/film stubs$/, /novel stubs$/, /[0-9]{4} video games/, /[0-9]{4} poems/],

  // ==Event==
  'Event/SportsEvent': [
    /. league seasons$/,
    /^(19|20)[0-9]{2} in (soccer|football|rugby|tennis|basketball|baseball|cricket|sports)/
  ],
  'Event/War': [/conflicts in [0-9]{4}/, /battles involving ./],
  Event: [/^(19|20)[0-9]{2} in /],

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
module.exports = patterns
