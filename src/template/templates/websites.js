//this format seems to be a pattern for these
const generic = ['id', 'title', 'description', 'section']
const idName = ['id', 'name']

//https://en.wikipedia.org/wiki/Category:External_link_templates
const externals = {
  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
  'afi film': generic,
  'allmovie title': generic,
  allgame: generic,
  'tcmdb title': generic,
  'discogs artist': generic,
  'discogs label': generic,
  'discogs release': generic,
  'discogs master': generic,
  'librivox author': generic,
  'musicbrainz artist': generic,
  'musicbrainz label': generic,
  'musicbrainz recording': generic,
  'musicbrainz release': generic,
  'musicbrainz work': generic,
  youtube: generic,
  'goodreads author': idName,
  'goodreads book': generic,
  twitter: idName,
  facebook: idName,
  instagram: idName,
  tumblr: idName,
  pinterest: idName,
  'espn nfl': idName,
  'espn nhl': idName,
  'espn fc': idName,
  hockeydb: idName,
  'fifa player': idName,
  worldcat: idName,
  'worldcat id': idName,
  'nfl player': idName,
  'ted speaker': idName,
  playmate: idName,
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,

  'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],

  congbio: ['id', 'name', 'date'],

  'hollywood walk of fame': ['name']
}
//alias
externals.imdb = externals['imdb name']
externals['imdb episodess'] = externals['imdb episode']
module.exports = externals
