const parseGallery = require('./gallery');
const parseElection = require('./election');
const parseNBA = require('./nba');
const parseMlb = require('./mlb');
const parseMMA = require('./mma');
const parseMath = require('./math');
// Most templates are '{{template}}', but then, some are '<template></template>'.
// ... others are {{start}}...{{end}}
// -> these are those ones.
const xmlTemplates = function(section, wiki) {
  wiki = parseGallery(wiki, section);
  wiki = parseElection(wiki, section);
  wiki = parseMath(wiki, section);
  wiki = parseNBA(wiki, section);
  wiki = parseMMA(wiki, section);
  wiki = parseMlb(wiki, section);
  return wiki;
};

module.exports = xmlTemplates;
