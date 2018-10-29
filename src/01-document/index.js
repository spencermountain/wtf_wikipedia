const Document = require('./Document');
const redirects = require('./redirects');
const disambig = require('./disambig');
const preProcess = require('./preProcess');
const parse = {
  section: require('../02-section'),
  categories: require('./categories')
};

//convert wikiscript markup lang to json
const main = function(wiki, options) {
  options = options || {};
  wiki = wiki || '';
  let data = {
    type: 'page',
    sections: [],
    categories: [],
    coordinates: [],
  };
  //detect if page is just redirect, and return it
  if (redirects.isRedirect(wiki) === true) {
    data.type = 'redirect';
    data.redirectTo = redirects.parse(wiki);
    parse.categories(data, wiki);
    return new Document(data, options);
  }
  //detect if page is just disambiguator page, and return
  if (disambig.isDisambig(wiki) === true) {
    data.type = 'disambiguation';
  }
  if (options.page_identifier) {
    data.page_identifier = options.page_identifier;
  }
  if (options.lang_or_wikiid) {
    data.lang_or_wikiid = options.lang_or_wikiid;
  }
  //give ourselves a little head-start
  wiki = preProcess(data, wiki, options);
  //pull-out [[category:whatevers]]
  wiki = parse.categories(data, wiki);
  //parse all the headings, and their texts/sentences
  data.sections = parse.section(wiki, options) || [];
  //all together now
  return new Document(data, options);
};

module.exports = main;
