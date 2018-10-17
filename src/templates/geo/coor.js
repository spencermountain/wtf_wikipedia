const convertDMS = require('./dms-format');

const hemispheres = {
  n: true,
  s: true,
  w: true,
  e: true,
};

const round = function(num) {
  if (typeof num !== 'number') {
    return num;
  }
  let places = 100000;
  return Math.round(num * places) / places;
};

const parseCoor = function(str) {
  let obj = {
    template: 'coord',
    lat: null,
    lon: null
  };
  let arr = str.split('|');
  //turn numbers into numbers, normalize N/s
  let nums = [];
  for(let i = 0; i < arr.length; i += 1) {
    let s = arr[i].trim();
    //make it a number
    let num = parseFloat(s);
    if (num || num === 0) {
      arr[i] = num;
      nums.push(num);
    } else if (s.match(/^scale:/i)) {
      obj.scale = s.replace(/^scale:/i, '');
      continue;
    } else if (s.match(/^type:/i)) {
      obj.type = s.replace(/^type:/i, '');
      continue;
    }
    //DMS-format
    if (hemispheres[s.toLowerCase()]) {
      if (obj.lat === null) {
        nums.push(s);
        obj.lat = convertDMS(nums);
        arr = arr.slice(i, arr.length);
        nums = [];
        i = 0;
      } else {
        nums.push(s);
        obj.lon = convertDMS(nums);
      }
    }
  }
  //this is an original `lat|lon` format
  if (!obj.lon && nums.length === 2) {
    obj.lat = nums[0];
    obj.lon = nums[1];
  }
  obj.lat = round(obj.lat);
  obj.lon = round(obj.lon);
  return obj;
};

module.exports = parseCoor;
// {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor title dec|latitude|longitude|template parameters}}
// {{Coor dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor dm|dd|mm|N/S|dd|mm|E/W|template parameters}}
// {{Coor dec|latitude|longitude|template parameters}}
