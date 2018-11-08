const dates = require('./dates');
const misc = require('./misc');
const currencies = require('./currencies');
const links = require('./links');
const formatting = require('./formatting');
const wiktionary = require('./wiktionary');
const lists = require('./lists');
const languages = require('./languages');

module.exports = Object.assign(
  {},
  dates,
  misc,
  currencies,
  links,
  lists,
  languages,
  formatting,
  wiktionary
);
