const i18n = require('../_data/i18n');
const parseLink = require('../04-sentence/links');
//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n.redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i');

const isRedirect = function(wiki) {
  //too long to be a redirect?
  if (!wiki || wiki.length > 500) {
    return false;
  }
  return REDIRECT_REGEX.test(wiki);
};

const parse = function(wiki) {
  let m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    let links = parseLink(m[2]) || [];
    return links[0];
  }
  return {};
};

module.exports = {
  isRedirect: isRedirect,
  parse: parse
};
