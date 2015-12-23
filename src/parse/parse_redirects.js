var i18n = require("../data/i18n");
//pulls target link out of redirect page
var REDIRECT_REGEX = new RegExp("^ ?#(" + i18n.redirects.join("|") + ") *?\\[\\[(.{2,60}?)\\]\\]", "i");

exports.is_redirect = function(wiki) {
  return wiki.match(REDIRECT_REGEX);
};

exports.parse_redirect = function(wiki) {
  var article = (wiki.match(REDIRECT_REGEX) || [])[2] || "";
  article = article.replace(/#.*/, "");
  return {
    type: "redirect",
    redirect: article
  };
};
