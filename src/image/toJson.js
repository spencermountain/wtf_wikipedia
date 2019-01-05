const setDefaults = require('../_lib/setDefaults');

const defaults = {
  caption: true,
  links: true,
  thumb: true,
  url: true,
};
//
const toJson = function(img, options) {
  options = setDefaults(options, defaults);
  let json = {
    file: img.file(),
  };
  if (options.thumb !== false) {
    json.thumb = img.thumbnail();
  }
  if (options.url !== false) {
    json.url = img.url();
  }
  //add captions
  if (options.caption !== false && img.data.caption) {
    json.caption = img.caption();
    if (options.links !== false && img.data.caption.links()) {
      json.links = img.links();
    }
  }
  return json;
};
module.exports = toJson;
