const i18n = require('../../data/i18n');
//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^ ?#(' + i18n.redirects.join('|') + ') *?\\[\\[(.{2,60}?)\\]\\]', 'i');

const is_redirect = function(wiki) {
  return wiki.match(REDIRECT_REGEX);
};

const parse_redirect = function(wiki) {
  let article = (wiki.match(REDIRECT_REGEX) || [])[2] || '';
  article = article.replace(/#.*/, '');
  return {
    type: 'redirect',
    redirect: article
  };
};

module.exports = {
  is_redirect: is_redirect,
  parse_redirect: parse_redirect
};
