
//
const toJson = function(p, options) {
  return p.lines().map(s => s.json(options));
};
module.exports = toJson;
