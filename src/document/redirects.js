const i18n = require('../data/i18n');
//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n.redirects.join('|') + ') *?(\\[\\[.{2,60}?\\]\\])', 'i');

const isRedirect = function(wiki) {
  return REDIRECT_REGEX.test(wiki);
};

const parse = function(wiki) {
  let m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    return m[2];
  }
  return wiki;
};

module.exports = {
  isRedirect: isRedirect,
  parse: parse
};
