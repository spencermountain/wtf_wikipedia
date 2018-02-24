//this is allowed to be rough
const day = 1000 * 60 * 60 * 24;
const month = day * 30;
const year = day * 365;

const getEpoch = function(obj) {
  return new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`).getTime();
};

//very rough!
const delta = function(from, to) {
  from = getEpoch(from);
  to = getEpoch(to);
  let diff = to - from;
  let obj = {};
  //get years
  let years = Math.floor(diff / year, 10);
  if (years > 0) {
    obj.years = years;
    diff -= (obj.years * year);
  }
  //get months
  let months = Math.floor(diff / month, 10);
  if (months > 0) {
    obj.months = months;
    diff -= (obj.months * month);
  }
  //get days
  let days = Math.floor(diff / day, 10);
  if (days > 0) {
    obj.days = days;
  // diff -= (obj.days * day);
  }
  return obj;
};

module.exports = delta;
