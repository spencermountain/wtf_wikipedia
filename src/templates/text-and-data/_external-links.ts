// the url patterns for external-link templates. See ./external-links.ts
export type Args = Record<string, string>
export interface Entry {
  order: string[] // positional argument names, kept as the data keys
  url: (d: Args, title?: string) => string | null
  label?: (d: Args, title: string) => string // defaults to name/title, then the page title, then the id
  site?: string // appended as ' at Site'
  joiner?: string // 'at' or 'on'
}

const enc = (str = '') => encodeURIComponent(str).replace(/%2F/g, '/').replace(/%3A/g, ':')
const first = (str = '') => str.charAt(0).toLowerCase()
// 'http://www.example.com/' → 'www.example.com'
const displayUrl = (url = '') => url.replace(/^[a-z]+:\/\//i, '').replace(/\/$/, '')
const withScheme = (url = '') => (/^[a-z]+:\/\//i.test(url) ? url : `https://${url}`)
const underscore = (str = '') => enc(str.replace(/ /g, '_'))

const idTitle = ['id', 'title', 'description', 'section']
const idName = ['id', 'name']
const idLabel = (prefix: string) => (d: Args) => `${prefix}${d.id}`

const entries: Record<string, Entry> = {
  // --- identifiers ---
  doi: { order: ['id'], url: (d) => `https://doi.org/${enc(d.id)}`, label: idLabel('doi:') },
  issn: { order: ['id'], url: (d) => `https://www.worldcat.org/issn/${enc(d.id)}`, label: idLabel('ISSN ') },
  oclc: { order: ['id'], url: (d) => `https://www.worldcat.org/oclc/${enc(d.id)}`, label: idLabel('OCLC ') },
  pmid: { order: ['id'], url: (d) => `https://pubmed.ncbi.nlm.nih.gov/${enc(d.id)}`, label: idLabel('PMID ') },
  pmc: { order: ['id'], url: (d) => `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${enc(d.id)}`, label: idLabel('PMC ') },
  arxiv: { order: ['id'], url: (d) => `https://arxiv.org/abs/${enc(d.id)}`, label: idLabel('arXiv:') },
  bibcode: { order: ['id'], url: (d) => `https://ui.adsabs.harvard.edu/abs/${enc(d.id)}`, label: idLabel('Bibcode:') },
  jstor: { order: ['id'], url: (d) => `https://www.jstor.org/stable/${enc(d.id)}`, label: idLabel('JSTOR ') },
  lccn: { order: ['id'], url: (d) => `https://lccn.loc.gov/${enc(d.id)}`, label: idLabel('LCCN ') },
  mr: { order: ['id'], url: (d) => `https://mathscinet.ams.org/mathscinet-getitem?mr=${enc(d.id)}`, label: idLabel('MR ') },
  zbl: { order: ['id'], url: (d) => `https://zbmath.org/?format=complete&q=an:${enc(d.id)}`, label: idLabel('Zbl ') },
  hdl: { order: ['id'], url: (d) => `https://hdl.handle.net/${enc(d.id)}`, label: idLabel('hdl:') },
  ssrn: { order: ['id'], url: (d) => `https://ssrn.com/abstract=${enc(d.id)}`, label: idLabel('SSRN ') },
  s2cid: { order: ['id'], url: (d) => `https://api.semanticscholar.org/CorpusID:${enc(d.id)}`, label: idLabel('S2CID ') },
  asin: { order: ['id'], url: (d) => `https://www.amazon.com/dp/${enc(d.id)}`, label: idLabel('ASIN ') },
  ol: { order: ['id'], url: (d) => `https://openlibrary.org/books/OL${enc(d.id)}`, label: idLabel('OL ') },
  rfc: { order: ['id'], url: (d) => `https://www.rfc-editor.org/rfc/rfc${enc(d.id)}`, label: idLabel('RFC ') },
  'us patent': {
    order: ['id'],
    url: (d) => `https://patents.google.com/patent/US${enc((d.id || '').replace(/,/g, ''))}`,
    label: idLabel('U.S. patent '),
  },
  oeis: { order: ['id'], url: (d) => `https://oeis.org/${enc(d.id)}`, label: idLabel('OEIS ') },
  'oeis link': { order: ['id'], url: (d) => `https://oeis.org/${enc(d.id)}`, label: (d) => d.id },
  gnis: { order: idName, url: (d) => `https://edits.nationalmap.gov/apps/gaz-domestic/public/summary/${enc(d.id)}`, site: 'GNIS' },
  'wikidata entity link': { order: ['id'], url: (d) => `https://www.wikidata.org/wiki/${enc(d.id)}`, label: (d) => d.id },

  // --- film & tv ---
  'imdb title': { order: idTitle, url: (d) => `https://www.imdb.com/title/tt${enc(d.id)}/`, site: 'IMDb' },
  'imdb name': { order: idTitle, url: (d) => `https://www.imdb.com/name/nm${enc(d.id)}/`, site: 'IMDb' },
  'imdb episode': { order: idTitle, url: (d) => `https://www.imdb.com/title/tt${enc(d.id)}/`, site: 'IMDb' },
  'imdb event': { order: idTitle, url: (d) => `https://www.imdb.com/event/ev${enc(d.id)}/`, site: 'IMDb' },
  'afi film': { order: idTitle, url: (d) => `https://catalog.afi.com/Catalog/moviedetails/${enc(d.id)}`, site: 'the AFI Catalog of Feature Films' },
  'allmovie title': { order: idTitle, url: (d) => `https://www.allmovie.com/movie/v${enc(d.id)}`, site: 'AllMovie' },
  'tcmdb title': { order: idTitle, url: (d) => `https://www.tcm.com/tcmdb/title/${enc(d.id)}/`, site: 'the TCM Movie Database' },
  'rotten tomatoes': {
    order: ['id', 'title'],
    url: (d) => `https://www.rottentomatoes.com/${d.type === 'tv' ? 'tv' : 'm'}/${enc(d.id)}`,
    site: 'Rotten Tomatoes',
  },
  'metacritic film': { order: ['id', 'title'], url: (d) => `https://www.metacritic.com/movie/${enc(d.id)}`, site: 'Metacritic' },
  'mojo title': { order: ['id', 'title'], url: (d) => `https://www.boxofficemojo.com/title/${enc(d.id)}/`, site: 'Box Office Mojo' },
  allgame: { order: idTitle, url: () => null, site: 'AllGame' },

  // --- music ---
  'discogs artist': { order: idTitle, url: (d) => `https://www.discogs.com/artist/${enc(d.id)}`, site: 'Discogs' },
  'discogs label': { order: idTitle, url: (d) => `https://www.discogs.com/label/${enc(d.id)}`, site: 'Discogs' },
  'discogs release': { order: idTitle, url: (d) => `https://www.discogs.com/release/${enc(d.id)}`, site: 'Discogs' },
  'discogs master': { order: idTitle, url: (d) => `https://www.discogs.com/master/${enc(d.id)}`, site: 'Discogs' },
  'musicbrainz artist': { order: idTitle, url: (d) => `https://musicbrainz.org/artist/${enc(d.id || d.mbid)}`, site: 'MusicBrainz' },
  'musicbrainz label': { order: idTitle, url: (d) => `https://musicbrainz.org/label/${enc(d.id || d.mbid)}`, site: 'MusicBrainz' },
  'musicbrainz recording': { order: idTitle, url: (d) => `https://musicbrainz.org/recording/${enc(d.id || d.mbid)}`, site: 'MusicBrainz' },
  'musicbrainz release': { order: idTitle, url: (d) => `https://musicbrainz.org/release/${enc(d.id || d.mbid)}`, site: 'MusicBrainz' },
  'musicbrainz work': { order: idTitle, url: (d) => `https://musicbrainz.org/work/${enc(d.id || d.mbid)}`, site: 'MusicBrainz' },
  allmusic: {
    order: ['id', 'label'],
    url: (d) => `https://www.allmusic.com/${enc(d.class || 'artist')}/${enc(d.id)}`,
    label: (d, title) => d.label || d.title || title || d.id,
    site: 'AllMusic',
  },

  // --- books & reference ---
  'goodreads book': { order: idTitle, url: (d) => `https://www.goodreads.com/book/show/${enc(d.id)}`, site: 'Goodreads' },
  'goodreads author': { order: idName, url: (d) => `https://www.goodreads.com/author/show/${enc(d.id)}`, site: 'Goodreads' },
  'librivox author': { order: idTitle, url: (d) => `https://librivox.org/author/${enc(d.id)}`, site: 'LibriVox' },
  gutenberg: {
    order: ['no', 'name'],
    url: (d) => (d.no ? `https://www.gutenberg.org/ebooks/${enc(d.no)}` : null),
    label: (d, title) => d.name || title || d.no || '',
    site: 'Project Gutenberg',
  },
  'gutenberg author': { order: idName, url: (d) => `https://www.gutenberg.org/ebooks/author/${enc(d.id)}`, site: 'Project Gutenberg' },
  worldcat: { order: idName, url: (d) => `https://www.worldcat.org/identities/${enc(d.id)}`, site: 'WorldCat' },
  'worldcat id': { order: idName, url: (d) => `https://www.worldcat.org/identities/${enc(d.id)}`, site: 'WorldCat' },
  britannica: { order: ['id', 'title'], url: (d) => `https://www.britannica.com/${d.id || ''}`, site: 'Encyclopædia Britannica' },
  dmoz: {
    order: idTitle,
    url: (d) => `https://curlie.org/${d.id || ''}`,
    // 'Society/Politics/Anarchism/' → 'Anarchism'
    label: (d, title) => d.title || title || (d.id || '').replace(/\/$/, '').split('/').pop() || '',
    site: 'Curlie',
  },
  mathworld: { order: ['id', 'title'], url: (d) => `https://mathworld.wolfram.com/${enc(d.id || d.urlname)}.html`, site: 'MathWorld' },
  springereom: { order: ['id', 'title'], url: (d) => `https://encyclopediaofmath.org/wiki/${enc(d.id)}`, site: 'the Encyclopedia of Mathematics' },
  mactutor: {
    order: ['id', 'title'],
    url: (d) => `https://mathshistory.st-andrews.ac.uk/Biographies/${enc(d.id)}/`,
    site: 'the MacTutor History of Mathematics Archive',
  },
  planetmath: { order: ['urlname', 'title'], url: (d) => `https://planetmath.org/${enc(d.urlname)}`, site: 'PlanetMath' },

  // --- people ---
  'find a grave': {
    order: ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],
    url: (d) => `https://www.findagrave.com/memorial/${enc(d.id)}`,
    site: 'Find a Grave',
  },
  congbio: {
    order: ['id', 'name', 'date'],
    url: (d) => `https://bioguide.congress.gov/search/bio/${enc(d.id)}`,
    site: 'the Biographical Directory of the United States Congress',
  },
  'c-span': { order: idName, url: (d) => `https://www.c-span.org/person/?${enc(d.id)}`, site: 'C-SPAN' },
  'ted speaker': { order: idName, url: (d) => `https://www.ted.com/speakers/${enc(d.id)}`, site: 'TED' },
  playmate: { order: idName, url: () => null },

  // --- social ---
  twitter: { order: idName, url: (d) => `https://twitter.com/${enc(d.id)}`, site: 'Twitter', joiner: 'on' },
  facebook: { order: idName, url: (d) => `https://www.facebook.com/${enc(d.id)}`, site: 'Facebook', joiner: 'on' },
  instagram: { order: idName, url: (d) => `https://www.instagram.com/${enc(d.id)}/`, site: 'Instagram', joiner: 'on' },
  tumblr: { order: idName, url: (d) => `https://${enc(d.id)}.tumblr.com`, site: 'Tumblr', joiner: 'on' },
  pinterest: { order: idName, url: (d) => `https://www.pinterest.com/${enc(d.id)}/`, site: 'Pinterest', joiner: 'on' },
  youtube: {
    order: idTitle,
    url: (d) => {
      // with a user or channel, the first positional argument is the title, not an id
      if (d.u || d.user) {
        return `https://www.youtube.com/user/${enc(d.u || d.user)}`
      }
      if (d.c || d.channel) {
        return `https://www.youtube.com/channel/${enc(d.c || d.channel)}`
      }
      if (d.id) {
        return `https://www.youtube.com/watch?v=${enc(d.id)}`
      }
      return null
    },
    label: (d, title) => {
      if (d.u || d.user || d.c || d.channel) {
        return d.title || d.name || d.id || title || ''
      }
      return d.title || d.name || title || d.id || ''
    },
    site: 'YouTube',
    joiner: 'on',
  },

  // --- sports ---
  'espn nfl': { order: idName, url: (d) => `https://www.espn.com/nfl/player/_/id/${enc(d.id)}`, site: 'ESPN' },
  'espn nhl': { order: idName, url: (d) => `https://www.espn.com/nhl/player/_/id/${enc(d.id)}`, site: 'ESPN' },
  'espn fc': { order: idName, url: (d) => `https://www.espn.com/soccer/player/_/id/${enc(d.id)}`, site: 'ESPN' },
  hockeydb: { order: idName, url: (d) => `https://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=${enc(d.id)}`, site: 'the Internet Hockey Database' },
  'nfl player': { order: idName, url: (d) => `https://www.nfl.com/players/${enc(d.id)}/`, site: 'NFL.com' },
  'fifa player': { order: idName, url: () => null, site: 'FIFA' },
  'baseball-reference': {
    order: idName,
    url: (d) => `https://www.baseball-reference.com/players/${first(d.id)}/${enc(d.id)}.shtml`,
    site: 'Baseball-Reference.com',
  },
  'basketball-reference': {
    order: idName,
    url: (d) => `https://www.basketball-reference.com/players/${first(d.id)}/${enc(d.id)}.html`,
    site: 'Basketball-Reference.com',
  },
  'pro-football-reference': {
    order: idName,
    url: (d) => `https://www.pro-football-reference.com/players/${first(d.id).toUpperCase()}/${enc(d.id)}.htm`,
    site: 'Pro-Football-Reference.com',
  },
  'hockey-reference': {
    order: idName,
    url: (d) => `https://www.hockey-reference.com/players/${first(d.id)}/${enc(d.id)}.html`,
    site: 'Hockey-Reference.com',
  },
  soccerbase: { order: idName, url: (d) => `https://www.soccerbase.com/players/player.sd?player_id=${enc(d.id)}`, site: 'Soccerbase' },
  soccerway: { order: idName, url: (d) => `https://int.soccerway.com/players/${enc(d.id)}/`, site: 'Soccerway' },
  olympedia: { order: idName, url: (d) => `https://www.olympedia.org/athletes/${enc(d.id)}`, site: 'Olympedia' },

  // --- link wrappers ---
  // {{URL|http://www.example.com|Example}} - https://en.wikipedia.org/wiki/Template:URL
  url: {
    order: ['url', 'text'],
    url: (d) => (d.url ? withScheme(d.url.trim()) : null),
    label: (d) => d.text || displayUrl(d.url || ''),
  },
  'official website': {
    order: ['url', 'name'],
    url: (d) => (d.url ? withScheme(d.url.trim()) : null),
    label: (d) => d.name || 'Official website',
  },
  plainlink: {
    order: ['url', 'text'],
    url: (d) => (d.url ? withScheme(d.url.trim()) : null),
    label: (d) => d.text || d.name || displayUrl(d.url || ''),
  },
  // {{webarchive|url=https://web.archive.org/web/2020/http://x.com|date=2020-01-01}}
  webarchive: { order: ['url', 'date', 'title'], url: (d) => d.url || null, label: () => 'Archived' },
  // {{wayback|url=http://x.com|date=20200101}}
  wayback: {
    order: ['url', 'title', 'date'],
    url: (d) => (d.url ? `https://web.archive.org/web/${d.date || ''}/${d.url}` : null),
    label: () => 'Archived',
  },

  // --- sister projects, as external links ---
  'wikisource-inline': {
    order: ['title', 'text'],
    url: (d, title) => `https://en.wikisource.org/wiki/${underscore(d.title || title)}`,
    label: (d, title) => d.text || d.title || title,
    site: 'Wikisource',
  },
  wikt: {
    order: ['word', 'text'],
    url: (d) => `https://en.wiktionary.org/wiki/${enc(d.word || '')}`,
    label: (d) => d.text || d.word || '',
  },
  'commons category-inline': {
    order: ['category', 'text'],
    url: (d, title) => `https://commons.wikimedia.org/wiki/Category:${underscore(d.category || title)}`,
    label: (d, title) => d.text || d.category || title,
    site: 'Wikimedia Commons',
  },
  'wikiquote-inline': {
    order: ['title', 'text'],
    url: (d, title) => `https://en.wikiquote.org/wiki/${underscore(d.title || title)}`,
    label: (d, title) => d.text || d.title || title,
    site: 'Wikiquote',
  },
}
export default entries
