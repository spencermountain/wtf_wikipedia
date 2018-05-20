const keyVal = /[a-z]{2} *?= *?[a-z0-9]/i;

const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

//templates that look like this:
// {{name|one|two|three}}
const pipeSplit = function(tmpl, order) {
  tmpl = strip(tmpl);
  let arr = tmpl.split(/\|/g);
  let obj = {
    template: arr[0].trim().toLowerCase()
  };
  arr.shift();
  order.forEach((k, i) => {
    if (arr[i]) {
      //support gross 'id=234' format inside the value
      if (keyVal.test(arr[i]) === true) {
        arr[i] = arr[i].split('=')[1];
      }
      arr[i] = arr[i].trim();
      obj[k] = arr[i];
    }
  });
  return obj;
};
module.exports = pipeSplit;
