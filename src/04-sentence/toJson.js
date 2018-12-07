const setDefaults = require('../_lib/setDefaults');
const isNumber = /^[0-9,.]+$/;

const defaults = {
  text: true,
  links: true,
  formatting: true,
  dates: true,
  numbers: true,
};

const toJSON = function(s, options) {
  options = setDefaults(options, defaults);
  let data = {};
  let text = s.plaintext();
  if (options.text === true) {
    data.text = text;
  }
  //add number field
  if (options.numbers === true && isNumber.test(text)) {
    let num = Number(text.replace(/,/g, ''));
    if (isNaN(num) === false) {
      data.number = num;
    }
  }
  if (options.links && s.links().length > 0) {
    data.links = s.links();
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt;
  }
  if (options.dates && s.data.dates !== undefined) {
    data.dates = s.data.dates;
  }
  return data;
};
module.exports = toJSON;
