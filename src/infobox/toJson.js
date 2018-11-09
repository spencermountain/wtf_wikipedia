const encode = require('../_lib/encode');

//turn an infobox into some nice json
const toJson = function(infobox, options) {
  let json = Object.keys(infobox.data).reduce((h, k) => {
    if (infobox.data[k]) {
      h[k] = infobox.data[k].json();
    }
    return h;
  }, {});

  //support mongo-encoding keys
  if (options.encode === true) {
    json = encode.encodeObj(json);
  }
  return json;
};
module.exports = toJson;
