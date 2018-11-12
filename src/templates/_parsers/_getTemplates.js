const strip = require('./_strip');
const open = '{';
const close = '}';

//
const findFlat = function(wiki) {
  let depth = 0;
  let list = [];
  let carry = [];
  for (var i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : (i = wiki.indexOf(open, i + 1))) {
    let c = wiki[i];
    //open it
    if (c === open) {
      depth += 1;
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          carry.push(c);
          let tmpl = carry.join('');
          carry = [];
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }
          continue;
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        continue;
      }
      carry.push(c);
    }
  }
  return list;
};

//get all nested templates
const findNested = function(top) {
  let deep = [];
  top.forEach((str) => {
    if (/\{\{/.test(str.substr(2)) === true) {
      str = strip(str);
      findFlat(str).forEach((o) => {
        if (o) {
          deep.push(o);
        }
      });
    }
  });
  return deep;
};

const getTemplates = function(wiki) {
  let list = findFlat(wiki);
  return {
    top: list,
    nested: findNested(list)
  };
};

module.exports = getTemplates;

// console.log(getTemplates('he is president. {{nowrap|he is {{age|1980}} years}} he lives in {{date}} texas'));
