const convertGeo = require('../../lib/convertGeo');
const hemispheres = {
  n: true,
  s: true,
  w: true,
  e: true,
};
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
const parseCoord = function(str) {
  let obj = {
    lat: null,
    lon: null
  };
  let arr = str.split('|');
  //turn numbers into numbers, normalize N/s
  let nums = [];
  for(let i = 0; i < arr.length; i += 1) {
    let s = arr[i];
    //make it a number
    let num = parseFloat(s);
    if (num || num === 0) {
      arr[i] = num;
      nums.push(num);
    }
    if (s.match(/^region:/i)) {
      obj.region = s.replace(/^region:/i, '');
      continue;
    }
    if (s.match(/^notes:/i)) {
      obj.notes = s.replace(/^notes:/i, '');
      continue;
    }
    //DMS-format
    if (hemispheres[s.toLowerCase()]) {
      if (obj.lat !== null) {
        obj.lon = arr.slice(0, i + 1);
      } else {
        obj.lat = arr.slice(0, i + 1);
        arr = arr.slice(i + 1, arr.length);
        i = 0;
      }
    }
  }
  if (obj.lat) {
    obj.lat = convertGeo(obj.lat);
  }
  if (obj.lon) {
    obj.lon = convertGeo(obj.lon);
  }
  return obj;
};
module.exports = parseCoord;
