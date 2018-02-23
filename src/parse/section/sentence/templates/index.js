const parsers = require('./parsers');
const templates = require('./templates');

//get identity of template - Template:Foo
const getName = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  let name = tmpl.split(/\|/)[0] || '';
  name = name.toLowerCase().trim();
  // name = name.replace(/-/g, ' ');
  return name;
};

//run each remaining {{template}} through our parsers
const parseTemplates = function(obj) {
  let list = obj.text.match(/\{\{([^}]+)\}\}/g) || [];
  list = list.map((tmpl) => {
    let name = getName(tmpl);
    return {
      name: name,
      raw: tmpl
    };
  });
  //try parsing each template
  list.forEach((t) => {
    //remove the {{'s & }}'s
    t.tmpl = t.raw.replace(/^\{\{/, '');
    t.tmpl = t.tmpl.replace(/\}\}$/, '');
    if (parsers.hasOwnProperty(templates[t.name]) === true) {
      let parser = templates[t.name];
      let result = parsers[parser](t.tmpl, obj);
      obj.text = obj.text.replace(t.raw, result);
    } else {
      //otherwise, just remove it from the text
      obj.text = obj.text.replace(t.raw, '');
    }
  });
  return obj;
};
module.exports = parseTemplates;
