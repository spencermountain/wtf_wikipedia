const parseGallery = require('./gallery');
const parseElection = require('./election');
// Most templates are '{{template}}', but then, some are '<template></template>'.
// ... others are {{start}}...{{end}}
// -> these are those ones.
const xmlTemplates = function(section, wiki) {
  wiki = parseGallery(wiki, section);
  wiki = parseElection(wiki, section);
  return wiki;
};

module.exports = xmlTemplates;