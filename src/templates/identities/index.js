const pipeSplit = require('../_parsers/pipeSplit');

//this format seems to be a pattern for these
const generic = (tmpl, r) => {
  let order = ['id', 'title', 'description', 'section'];
  let obj = pipeSplit(tmpl, order);
  r.templates.push(obj);
  return '';
};
const idName = (tmpl, r) => {
  let order = ['id', 'name'];
  let obj = pipeSplit(tmpl, order);
  r.templates.push(obj);
  return '';
};

//https://en.wikipedia.org/wiki/Category:External_link_templates
const externals = {

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
  'afi film': generic,
  'allmovie title': generic,
  'allgame': generic,
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
  'youtube': generic,
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,
  'find a grave': (tmpl, r) => {
    let order = ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'congbio': (tmpl, r) => {
    let order = ['id', 'name', 'date'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'hollywood walk of fame': (tmpl, r) => {
    let order = ['name'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'goodreads author': idName,
  'goodreads book': generic,
  'twitter': idName,
  'facebook': idName,
  'instagram': idName,
  'tumblr': idName,
  'pinterest': idName,
  'espn nfl': idName,
  'espn nhl': idName,
  'espn fc': idName,
  'hockeydb': idName,
  'fifa player': idName,
  'worldcat': idName,
  'worldcat id': idName,
  'nfl player': idName,
  'ted speaker': idName,
  'playmate': idName,
};
//alias
externals.imdb = externals['imdb name'];
externals['imdb episodess'] = externals['imdb episode'];
module.exports = externals;
