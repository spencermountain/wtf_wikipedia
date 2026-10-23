let templates = {}
// these all have ['id', 'name']
let idName = [
  'goodreads author',
  'twitter',
  'facebook',
  'instagram',
  'tumblr',
  'pinterest',
  'espn nfl',
  'espn nhl',
  'espn fc',
  'hockeydb',
  'fifa player',
  'worldcat',
  'worldcat id',
  'nfl player',
  'ted speaker',
  'playmate',
]
idName.forEach((name) => {
  templates[name] = ['id', 'name']
})
export default templates
