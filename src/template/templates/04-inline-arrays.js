//this format seems to be a pattern for these

//https://en.wikipedia.org/wiki/Category:External_link_templates
let templates = {
  'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],
  congbio: ['id', 'name', 'date'],
  'hollywood walk of fame': ['name'],
  'wide image': ['file', 'width', 'caption'],
  audio: ['file', 'text', 'type'],
  rp: ['page'],
  'short description': ['description'],
  'coord missing': ['region'],
  unreferenced: ['date'],
  uss: ['ship', 'id'],
  'taxon info': ['taxon', 'item'], //https://en.wikipedia.org/wiki/Template:Taxon_info
  'portuguese name': ['first', 'second', 'suffix'], // https://en.wikipedia.org/wiki/Template:Portuguese_name
  geo: ['lat', 'lon', 'zoom'], //https://en.wikivoyage.org/wiki/Template:Geo
}

// these all have ['id', 'name']
let arr = [
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
arr.forEach((name) => {
  templates[name] = ['id', 'name']
})

// these all have ['id', 'title', 'description', 'section']
arr = [
  'imdb title', //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb name',
  'imdb episode',
  'imdb event',
  'afi film',
  'allmovie title',
  'allgame',
  'tcmdb title',
  'discogs artist',
  'discogs label',
  'discogs release',
  'discogs master',
  'librivox author',
  'musicbrainz artist',
  'musicbrainz label',
  'musicbrainz recording',
  'musicbrainz release',
  'musicbrainz work',
  'youtube',
  'goodreads book',
  'dmoz', //https://en.wikipedia.org/wiki/Template:DMOZ
]
arr.forEach((name) => {
  templates[name] = ['id', 'title', 'description', 'section']
})

module.exports = templates
