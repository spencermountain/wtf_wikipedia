const Document = require('./document/Document');
const fetch = require('./fetch');
const version = require('../package').version;

//the main 'factory' exported method
const wtf = function(wiki, options) {
  return new Document(wiki, options);
};
wtf.fetch = function(title, lang, options, cb) {
  return fetch(title, lang, options, cb);
};
wtf.version = version;

module.exports = wtf;
