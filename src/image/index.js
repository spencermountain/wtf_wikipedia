const i18n = require('../data/i18n');
const parseImage = require('./parse-image');
const fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

const parseImages = function(matches, r, wiki, options) {
  matches.forEach(function(s) {
    if (s.match(fileRegex)) {
      r.images = r.images || [];
      if (options.images !== false) {
        r.images.push(parseImage(s));
      }
      wiki = wiki.replace(s, '');
    }
  });
  return wiki;
};
module.exports = parseImages;
