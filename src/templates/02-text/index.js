const dates = require('./dates');
const inline = require('./inline');
const currencies = require('./currencies');
const links = require('./links');
const formatting = require('./formatting');
const wiktionary = require('./wiktionary');

module.exports = Object.assign(
  {},
  dates,
  inline,
  currencies,
  links,
  formatting,
  wiktionary
);
