const fetch = require('./fetch');
const version = require('../package').version;
const parseDocument = require('./01-document/index.js');

//the main 'factory' exported method
const wtf = function(wiki, options) {
  return parseDocument(wiki, options);
};
wtf.fetch = function(title, lang, options, cb) {
  return fetch.getPage(title, lang, options, cb);
};
wtf.random = function(lang, options, cb) {
  return fetch.random(lang, options, cb);
};
wtf.version = version;

module.exports = wtf;
