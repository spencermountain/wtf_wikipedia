
//turn {{name|one|two|three}} into [name, one, two, three]
const pipeSplitter = function(tmpl) {
  //start with a naiive '|' split
  let arr = tmpl.split(/\n?\|/);
  //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/
  arr.forEach((a, i) => {
    if (a === null) {
      return;
    }
    //has '[[' but no ']]'
    if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a)) {
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  });
  //cleanup any mistakes we've made
  arr = arr.map((a) => (a || '').trim());
  arr = arr.filter((a) => a);
  return arr;
};
module.exports = pipeSplitter;
