const open = '{';
const close = '}';

const strip = (str) => {
  str = str.replace(/^\{\{/, '');
  str = str.replace(/\}\}$/, '');
  return str;
};

//
const findFlat = function(wiki) {
  let depth = 0;
  let list = [];
  let carry = [];
  let chars = wiki.split('');
  chars.forEach((c) => {
    //open it
    if (c === open) {
      depth += 1;
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          let tmpl = carry.join('') + c;
          carry = [];
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }
          return;
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        return;
      }
      carry.push(c);
      return;
    }
  });
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
