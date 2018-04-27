const defaults = {
  categories: true,
  citations: true,
  coordinates: true,
};

//an opinionated output of the most-wanted data
const toJSON = function(doc, options) {
  options = options || {};
  let obj = {
    title: doc.options.title,
    pageID: doc.options.pageID,
    categories: doc.categories(),
    citations: doc.citations(),
    coordinates: doc.coordinates(),

    infoboxes: doc.infoboxes().map(i => i.json()),
    images: doc.images().map(i => i.json()),

  };
  return obj;
};
module.exports = toJSON;
