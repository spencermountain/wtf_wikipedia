const setDefaults = require('../_lib/setDefaults');
const defaults = {
  title: true,
  sections: true,
  pageID: true,
  categories: true,
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
  if (options.sections) {
    data.sections = doc.sections().map(i => i.json(options));
  }
  if (doc.isRedirect() === true) {
    data.isRedirect = true;
    data.redirectTo = doc.data.redirectTo;
    data.sections = [];
  }

  //these are default-off
  if (options.coordinates) {
    data.coordinates = doc.coordinates();
  }
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(i => i.json(options));
  }
  if (options.images) {
    data.images = doc.images().map(i => i.json(options));
  }
  if (options.plaintext) {
    data.plaintext = doc.plaintext(options);
  }
  if (options.citations) {
    data.references = doc.references();
  }
  if (options.markdown) {
    data.markdown = doc.markdown(options);
  }
  if (options.html) {
    data.html = doc.html(options);
  }
  if (options.latex) {
    data.latex = doc.latex(options);
  }
  return data;
};
module.exports = toJSON;
