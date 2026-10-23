let templates = {}
// these all have ['id', 'title', 'description', 'section']
let idTitle = [
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
idTitle.forEach((name) => {
  templates[name] = ['id', 'title', 'description', 'section']
})
export default templates
