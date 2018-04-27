const setDefaults = require('../../lib/setDefaults');
const defaults = {
  title: true,
  depth: true,
  sentences: true,
  links: true,
  text: true,
  formatting: true,
  dates: true,
  tables: true,
  lists: true,
  templates: true,
  images: true,
};
//
const toJSON = function(s, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.title) {
    data.title = s.title();
  }
  if (options.depth) {
    data.depth = s.depth;
  }
  //these return objects
  if (options.sentences) {
    data.sentences = s.sentences().map(sen => sen.json(options));
  }
  if (options.images && s.images().length > 0) {
    data.images = s.images().map(img => img.json(options));
  }
  //more stuff
  if (options.tables && s.tables().length > 0) {
    data.tables = s.tables();
  }
  if (options.templates && s.templates().length > 0) {
    data.templates = s.templates();
  }
  if (options.lists && s.lists().length > 0) {
    data.tables = s.lists();
  }
  return data;
};
module.exports = toJSON;
