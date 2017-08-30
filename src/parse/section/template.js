const main_reg = /\{\{main( article)?\|(.*?)\}\}/i;

//just some easy, supported ones
const parseTemplates = function(r, wiki) {
  let templates = {};
  let main = wiki.match(main_reg);
  if (main) {
    templates.main = main[2].split('|');
    wiki = wiki.replace(main_reg, '');
  }
  if (Object.keys(templates).length > 0) {
    r.templates = templates;
  }
  return wiki;
};
module.exports = parseTemplates;
