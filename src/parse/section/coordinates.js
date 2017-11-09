
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
let isLat = {
  n: true,
  s: true
};
let isLon = {
  e: true,
  w: true
};

const parseCoord = function(str) {
  let obj = {
    lat: null,
    lon: null,
    format: null
  };
  let arr = str.split('|');
  //turn numbers into numbers, normalize N/s
  arr = arr.map(s => {
    let num = parseFloat(s);
    if (num || num === 0) {
      return num;
    }
    if (isLat[s.toLowerCase()]) {
      return 'lat';
    }
    if (isLon[s.toLowerCase()]) {
      return 'lon';
    }
    if (s.match(/^region:/i)) {
      obj.region = s.replace(/^region:/i, '');
    }
    return null;
  });
  arr = arr.filter(s => s);
  console.log(arr);
  return obj;
};
module.exports = parseCoord;
