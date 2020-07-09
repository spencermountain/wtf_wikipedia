const parseGallery = require('./gallery')
const parseElection = require('./election')
const parseNBA = require('./nba')
const parseMlb = require('./mlb')
const parseMMA = require('./mma')
const parseMath = require('./math')
// Most templates are '{{template}}', but then, some are '<template></template>'.
// ... others are {{start}}...{{end}}
// -> these are those ones.
const xmlTemplates = function (section, doc) {
  parseElection(section)
  parseGallery(section, doc)
  parseMath(section)
  parseMlb(section)
  parseMMA(section)
  parseNBA(section)
}

module.exports = xmlTemplates
