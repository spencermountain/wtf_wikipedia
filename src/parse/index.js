const redirects = require('./page/redirects');
const disambig = require('./page/disambig');
const preProcess = require('./preProcess');
const postProcess = require('./postProcess');
const parse_sections = require('./section');
const infobox = require('./infobox');

//convert wikiscript markup lang to json
const main = function(wiki) {
  wiki = wiki || '';
  //detect if page is just redirect, and return
  if (redirects.is_redirect(wiki)) {
    return redirects.parse_redirect(wiki);
  }
  //detect if page is just disambiguator page, and return
  if (disambig.is_disambig(wiki)) {
    return disambig.parse_disambig(wiki);
  }
  let r = {
    type: 'page',
    sections: [],
    infoboxes: [],
    interwiki: {},
    categories: [],
    images: []
  };

  //give ourselves a little head-start
  wiki = preProcess(wiki);
  //pull-out infoboxes and stuff
  wiki = infobox(r, wiki);
  //parse all the headings, and their texts/sentences
  r.sections = parse_sections(wiki);

  // get categories from last section
  // wiki = parse_categories(r, wiki);
  r = postProcess(r);

  return r;
};

module.exports = main;
