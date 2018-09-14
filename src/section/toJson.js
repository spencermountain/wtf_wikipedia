const setDefaults = require('../lib/setDefaults');
const defaults = {
  title: true,
  depth: true,
  paragraphs: true,
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
const toJSON = function(section, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.title) {
    data.title = section.title();
  }
  if (options.depth) {
    data.depth = section.depth;
  }
  //these return objects
  if (options.paragraphs === true) {
    data.paragraphs = section.paragraphs().map(p => p.json(options));
  }
  if (options.sentences === true) {
    data.sentences = section.sentences().map(s => s.json(options));
  }
  if (options.images) {
    data.images = section.images().map(img => img.json(options));
  }
  //more stuff
  if (options.tables) {
    data.tables = section.tables().map(t => t.json(options));
  }
  if (options.templates) {
    data.templates = section.templates();
  }
  if (options.lists) {
    data.lists = section.lists().map(list => list.json(options));
  }
  return data;
};
module.exports = toJSON;
