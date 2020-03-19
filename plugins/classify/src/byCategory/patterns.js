const patterns = {
  'Thing/Character': [/fictional characters/],

  Person: [
    /[0-9]{4} births/,
    /[0-9]{4} deaths/,
    /people of .* descent/,
    /^(people|philanthropists|writers) from ./,
    / (players|alumni)$/,
    /(people|writer) stubs$/,
    /american (fe)?male /
  ],

  'Person/Politician': [/politicians from ./, /politician stubs$/],

  'Person/Athlete': [/sportspeople from ./, /footballers/],
  'Person/Actor': [/actresses/, /actors from ./, /actor stubs$/],

  'Person/Artist': [/musicians from ./, /singers/, /songwriters/],

  Place: [/populated places/, /municipalities in ./, /geography stubs$/, /sports venue stubs$/],

  CreativeWork: [/film stubs$/, /novel stubs$/, /[0-9]{4} video games/],
  'CreativeWork/Album': [/[0-9]{4} albums/, /albums produced by /],

  Event: [/^(19|20)[0-9]{2} in /],

  Organization: [
    /organi[sz]ations based in /,
    /organi[sz]ations established in [0-9]{4}/,
    /organi[sz]ation stubs$/
  ],
  'Organization/MusicalGroup': [
    /musical groups from /,
    /musical groups established in [0-9]{4}/,
    /musical group stubs/
  ],
  'Organization/SportsTeam': [/sports clubs established in [0-9]{4}/]
}
module.exports = patterns
