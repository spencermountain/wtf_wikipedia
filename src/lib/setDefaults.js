
//
const setDefaults = function(options, defaults) {
  let obj = {};
  defaults = defaults || {};
  Object.keys(defaults).forEach((k) => {
    obj[k] = defaults[k];
  });
  options = options || {};
  Object.keys(options).forEach((k) => {
    obj[k] = options[k];
  });
  return obj;
};
module.exports = setDefaults;
