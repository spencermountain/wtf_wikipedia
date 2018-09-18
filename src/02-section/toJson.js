const setDefaults = require('../lib/setDefaults');
const defaults = {
  headers: true,
  depth: true,
  paragraphs: true,
  images: true,
  tables: true,
  templates: true,
  lists: true,
};
//
const toJSON = function(section, options) {
  options = setDefaults(options, defaults);
  let data = {};
  if (options.headers === true) {
    data.title = section.title();
  }
  if (options.depth === true) {
    data.depth = section.depth;
  }
  //these return objects
  if (options.paragraphs === true) {
    data.paragraphs = section.paragraphs().map(p => p.json(options));
  }
  if (options.images === true) {
    data.images = section.images().map(img => img.json(options));
  }
  //more stuff
  if (options.tables === true) {
    data.tables = section.tables().map(t => t.json(options));
  }
  if (options.templates === true) {
    data.templates = section.templates();
  }
  if (options.lists === true) {
    data.lists = section.lists().map(list => list.json(options));
  }
  //default off
  if (options.sentences === true) {
    data.sentences = section.sentences().map(s => s.json(options));
  }
  return data;
};
module.exports = toJSON;
