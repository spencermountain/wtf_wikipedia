const Document = require('./01-document/Document');
const fetch = require('./fetch');
const version = require('../package').version;
const parseDocument = require('./01-document/index.js');

//the main 'factory' exported method
const wtf = function(wiki, options) {
  let data = parseDocument(wiki, options);
  return new Document(data, options);
};
wtf.fetch = function(title, lang, options, cb) {
  return fetch(title, lang, options, cb);
};
wtf.version = version;

module.exports = wtf;
