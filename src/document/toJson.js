const setDefaults = require('../lib/setDefaults');
const redirects = require('./redirects');

const defaults = {
  title: true,
  pageID: true,
  categories: true,
  coordinates: true,
  sections: true,
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
  if (options.citations) {
    data.citations = doc.citations();
  }
  if (options.coordinates) {
    data.coordinates = doc.coordinates();
  }

  //these need their own .json() method
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(i => i.json(options));
  }
  if (options.images) {
    data.images = doc.images().map(i => i.json(options));
  }
  if (options.sections) {
    data.sections = doc.sections().map(i => i.json(options));
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
  if (doc.isRedirect() === true) {
    data.isRedirect = true;
    data.redirectTo = redirects.parse(doc.wiki);
    data.sections = [];
  }
  return data;
};
module.exports = toJSON;
