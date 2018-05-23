const pipeSplit = require('./parsers/pipeSplit');
// const keyValue = require('./parsers/keyValue');
// const getInside = require('./parsers/inside');
// const pipeList = require('./parsers/pipeList');
//

//this format seems to be a pattern for these
const generic = (tmpl) => {
  let order = ['id', 'title', 'description', 'section'];
  let obj = pipeSplit(tmpl, order);
  let name = obj.template.split(' ');
  obj.template = name[0];
  obj.type = name[1];
  return obj;
};

const externals = {

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,
  'find a grave': (tmpl) => {
    let order = ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'];
    return pipeSplit(tmpl, order);
  },
  'discogs artist': generic,
  'discogs label': generic,
  'discogs release': generic,
  'discogs master': generic,
  'librivox author': generic,
};
//alias
externals.imdb = externals['imdb name'];
externals['imdb episodess'] = externals['imdb episode'];
module.exports = externals;
