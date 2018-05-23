const pipeList = require('../parsers/pipeList');

//generic form that looks like - {{name|foo|bar}}
const doList = function(tmpl, name) {
  let data = pipeList(tmpl);
  return {
    template: name,
    data: data
  };
};
module.exports = doList;
