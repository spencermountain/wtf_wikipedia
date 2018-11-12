const setDefaults = require('../_lib/setDefaults');
const encode = require('../_lib/encode');

const defaults = {
  headers: true,
  depth: true,
  paragraphs: true,
  images: true,
  tables: true,
  templates: true,
  infoboxes: true,
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
  //image json data
  if (options.images === true) {
    data.images = section.images().map(img => img.json(options));
  }
  //table json data
  if (options.tables === true) {
    data.tables = section.tables().map(t => t.json(options));
  }
  //template json data
  if (options.templates === true) {
    data.templates = section.templates();
    //encode them, for mongodb
    if (options.encode === true) {
      data.templates.forEach((t) => {
        if (t.data) {
          t.data = encode.encodeObj(t.data);
        }
      });
    }
  }
  //infobox json data
  if (options.infoboxes === true) {
    data.infoboxes = section.infoboxes().map(i => i.json(options));
  }
  //list json data
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
