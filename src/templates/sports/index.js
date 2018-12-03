const parse = require('../_parsers/parse');

const misc = {
  'baseball secondary style': function(tmpl) {
    let obj = parse(tmpl, ['name']);
    return obj.name;
  }
};

module.exports = Object.assign({},
  misc,
  require('./soccer')
);
