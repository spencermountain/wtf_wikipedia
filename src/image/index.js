const i18n = require('../data/i18n');
const parseImage = require('./parse-image');
const fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

const parseImages = function(matches, r, wiki) {
  matches.forEach(function(s) {
    if (s.match(fileRegex)) {
      r.images = r.images || [];
      let img = parseImage(s);
      if (img) {
        r.images.push(img);
      }
      wiki = wiki.replace(s, '');
    }
  });
  return wiki;
};
module.exports = parseImages;
