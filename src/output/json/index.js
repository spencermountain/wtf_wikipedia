const setDefaults = require('../../lib/setDefaults');
const defaults = {
  title: true,
  pageID: true,
  categories: true,
  citations: true,
  coordinates: true,
  infoboxes: true,
  sections: true,

  images: false, //these are already in sections/infoboxes
  plaintext: false,
  html: false,
  markdown: false,
};

//an opinionated output of the most-wanted data
const toJSON = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = {};

  if (options.title) {
    data.title = doc.options.title || doc.title();
  }
  if (options.pageID && doc.options.pageID) {
    data.pageID = doc.options.pageID;
  }
  if (options.categories) {
    data.categories = doc.categories();
  }
  if (options.citations && doc.citations().length > 0) {
    data.citations = doc.citations();
  }
  if (options.coordinates && doc.coordinates().length > 0) {
    data.coordinates = doc.coordinates();
  }

  //these need their own .json() method
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(i => i.json());
  }
  if (options.images) {
    data.images = doc.images().map(i => i.json());
  }
  if (options.sections) {
    data.sections = doc.sections().map(i => i.json());
  }

  //these are default-off
  if (options.plaintext) {
    data.plaintext = doc.plaintext(options);
  }
  if (options.markdown) {
    data.markdown = doc.markdown(options);
  }
  if (options.html) {
    data.html = doc.html(options);
  }
  return data;
};
module.exports = toJSON;
