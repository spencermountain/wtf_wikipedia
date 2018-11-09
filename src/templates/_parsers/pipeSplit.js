const keyVal = /[a-z0-9]+ *?= *?[a-z0-9]/i;
const pipes = require('./_pipes');

//templates that look like this:
// {{name|one|two|three}}
const pipeSplit = function(tmpl, order) {
  let found = pipes(tmpl);
  let obj = {
    template: found.name
  };
  let arr = found.list || [];
  order.forEach((k, i) => {
    if (arr[i]) {
      //support gross 'id=234' format inside the value
      let val = arr[i];
      let key = k;
      if (keyVal.test(arr[i]) === true) {
        let both = arr[i].split('=');
        val = both[1];
        if (isNaN(parseInt(both[0], 10))) {
          key = both[0].trim().toLowerCase();
        } else {
          key = order[parseInt(both[0], 10) - 1];
        }
      }
      val = val.trim();
      obj[key] = val;
    }
  });
  return obj;
};
module.exports = pipeSplit;
